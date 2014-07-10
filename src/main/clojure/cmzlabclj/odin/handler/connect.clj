
(ns ^{
      })

(defn MakeWebSockHandler ""

  []

  (proxy [WebSocketConnectHandler][]
    (channelRead0 [ctx obj]
      (let [ch (.channel ^ChannelHandlerContext ctx)
            ^TextWebSocketFrame msg obj
            event (DecodeOEvent (.text frame))
            rm (.remoteAddress ch)
            etype (:type event) ]
        (cond
          (= OEvents/LOGIN etype)
          (let [cred (:source event)
                player (.lookupPlayer this
                                      (nth cred 1)
                                      (nth cred 2)) ]
            (log/debug "login attempt from " rm)
            (.handleLogin this player ch)
            (.handleGameRoomJoin this player ch (nth cred 0)))

          (= OEvents/RECONNECT etype)
          (let [s (.lookupSession this (:source event)) ]
            (log/debug "reconnect attempt from " rm)
            (.handleReconnect this s ch))

          :else
          (do
            (log/warn "invalid event (" etype ") sent from " rm)
            (.closeOnConnectFailure ch)))
      ))

    (lookupSession [reconnKey]
      (when-let [^PlayerSession ps (.getSession reconnectRegistry reconnKey) ]
        (CoreUtils/syncExec ps
                            (reify Callable []
                              (call [_]
                                (if (= OSession$Status/NOT_CONNECTED
                                       (.getStatus ps))
                                  (doto ps (.setStatus OSession$Status/CONNECTING))
                                  nil))))))


    ))



  protected void handleReconnect(PlayerSession playerSession, Channel channel) throws Exception
  {
    if (null != playerSession)
    {
      channel.writeAndFlush(eventToFrame(Events.LOG_IN_SUCCESS, null));
      GameRoom gameRoom = playerSession.getGameRoom();
      gameRoom.disconnectSession(playerSession);
      if (null != playerSession.getTcpSender())
        playerSession.getTcpSender().close();

      handleReJoin(playerSession, gameRoom, channel);
    }
    else
    {
      // Write future and close channel
      closeChannelWithLoginFailure(channel);
    }
  }

  protected void handleReJoin(PlayerSession playerSession, GameRoom gameRoom, Channel channel)
  {
    // Set the tcp channel on the session.
    NettyTCPMessageSender sender = new NettyTCPMessageSender(channel);
    playerSession.setTcpSender(sender);
    // Connect the pipeline to the game room.
    gameRoom.connectSession(playerSession);
    channel.writeAndFlush(Events.GAME_ROOM_JOIN_SUCCESS, null);//assumes that the protocol applied will take care of event objects.
    playerSession.setWriteable(true);// TODO remove if unnecessary. It should be done in start event
    // Send the re-connect event so that it will in turn send the START event.
    playerSession.onEvent(new ReconnetEvent(sender));
  }

  public Player lookupPlayer(String username, String password) throws Exception
  {
    Credentials credentials = new SimpleCredentials(username, password);
    Player player = lookupService.playerLookup(credentials);
    if (null == player)
    {
      LOG.error("Invalid credentials provided by user: {}", credentials);
    }
    return player;
  }

  public void handleLogin(Player player, Channel channel) throws Exception
  {
    if (null != player)
    {
      channel.writeAndFlush(eventToFrame(Events.LOG_IN_SUCCESS, null));
    }
    else
    {
      // Write future and close channel
      closeChannelWithLoginFailure(channel);
    }
  }

  protected void closeChannelWithLoginFailure(Channel channel) throws Exception
  {
    // Close the connection as soon as the error message is sent.
    channel.writeAndFlush(eventToFrame(Events.LOG_IN_FAILURE, null)).addListener(
        ChannelFutureListener.CLOSE);
  }

  public void handleGameRoomJoin(Player player, Channel channel, String refKey) throws Exception
  {
    GameRoom gameRoom = lookupService.gameRoomLookup(refKey);
    if (null != gameRoom)
    {
      PlayerSession playerSession = gameRoom.createPlayerSession(player);
      String reconnectKey = (String)idGeneratorService
          .generateFor(playerSession.getClass());
      playerSession.setAttribute(NadronConfig.RECONNECT_KEY, reconnectKey);
      playerSession.setAttribute(NadronConfig.RECONNECT_REGISTRY, reconnectRegistry);
      LOG.trace("Sending GAME_ROOM_JOIN_SUCCESS to channel {}",
          channel);
      ChannelFuture future = channel.writeAndFlush(eventToFrame(
          Events.GAME_ROOM_JOIN_SUCCESS, reconnectKey));
      connectToGameRoom(gameRoom, playerSession, future);
    }
    else
    {
      // Write failure and close channel.
      ChannelFuture future = channel.writeAndFlush(eventToFrame(
          Events.GAME_ROOM_JOIN_FAILURE, null));
      future.addListener(ChannelFutureListener.CLOSE);
      LOG.error(
          "Invalid ref key provided by client: {}. Channel {} will be closed",
          refKey, channel);
    }
  }

  public void connectToGameRoom(final GameRoom gameRoom,
      final PlayerSession playerSession, ChannelFuture future)
  {
    future.addListener(new ChannelFutureListener()
    {
      @Override
      public void operationComplete(ChannelFuture future)
          throws Exception
      {
        Channel channel = future.channel();
        LOG.trace(
            "Sending GAME_ROOM_JOIN_SUCCESS to channel {} completed",
            channel);
        if (future.isSuccess())
        {
          // Set the tcp channel on the session.
          NettyTCPMessageSender tcpSender = new NettyTCPMessageSender(
              channel);
          playerSession.setTcpSender(tcpSender);
          // Connect the pipeline to the game room.
          gameRoom.connectSession(playerSession);
          // send the start event to remote client.
          tcpSender.sendMessage(Events.event(null, Events.START));
          gameRoom.onLogin(playerSession);
        }
        else
        {
          LOG.error("Sending GAME_ROOM_JOIN_SUCCESS message to client was failure, channel will be closed");
          channel.close();
        }
      }
    });
  }

  protected TextWebSocketFrame eventToFrame(byte opcode, Object payload) throws Exception
  {
    Event event = Events.event(payload, opcode);
    return new TextWebSocketFrame(jackson.writeValueAsString(event));
  }

  public LookupService getLookupService()
  {
    return lookupService;
  }

  public void setLookupService(LookupService lookupService)
  {
    this.lookupService = lookupService;
  }

  public ReconnectSessionRegistry getReconnectRegistry()
  {
    return reconnectRegistry;
  }

  public void setReconnectRegistry(ReconnectSessionRegistry reconnectRegistry)
  {
    this.reconnectRegistry = reconnectRegistry;
  }

  public UniqueIDGeneratorService getIdGeneratorService()
  {
    return idGeneratorService;
  }

  public void setIdGeneratorService(UniqueIDGeneratorService idGeneratorService)
  {
    this.idGeneratorService = idGeneratorService;
  }

  public ObjectMapper getJackson()
  {
    return jackson;
  }

  public void setJackson(ObjectMapper jackson)
  {
    this.jackson = jackson;
  }

}
