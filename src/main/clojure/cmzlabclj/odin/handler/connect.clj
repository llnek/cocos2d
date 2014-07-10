
(ns ^{
      })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- closeOnConnectFailure ""

  [^Channel ch]

  (-> (.writeAndFlush ch (EventToFrame OEvents/LOGIN_NOK))
      (.addListener ChannelFutureListener.CLOSE)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- connectToRoom  ""

  [^PlayRoom gm ^PlayerSession ps ^Channel ch]

  (let [s (NettyTCPMessageSender. ch) ]
    (.setTcpSender ps s)
    (.connect gm ps)
    (.sendMessage s (OEvents/event nil OEvents/START))
    (.onConnect gm ps)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- makeWebSockHandler ""

  []

  (proxy [WebSocketConnectHandler][]
    (channelRead0 [ctx obj]
      (let [ch (.channel ^ChannelHandlerContext ctx)
            ^TextWebSocketFrame msg obj
            event (DecodeEvent (.text frame))
            rm (.remoteAddress ch)
            etype (:type event) ]
        (condp = etype
          OEvents/LOGIN (let [cred (:source event)
                              p (LookupPlayer (nth cred 1) (nth cred 2)) ]
                          (log/debug "connect attempt from " ch)
                          (.doConnect this p ch)
                          (.doJoin this p ch (nth cred 0)))

          OEvents/RECONNECT (let [s (LookupSession (:source event)) ]
                              (log/debug "reconnect attempt from " ch)
                              (.doReconnect this s ch))

          (do
            (log/warn "invalid event (" etype ") sent from " ch)
            (closeOnConnectFailure ch)))))

    (doReconnect [ps ch]
      (if (nil? ps)
        (closeOnConnectFailure ch)
        (let [gm (.room ps) ]
          (.writeAndFlush ch (EventToFrame OEvents/LOGIN_OK ))
          (when-not (nil? gm) (.disconnect gm ps))
          (when-let [s (.getTcpSender ps)] (.close s))
          (.doRejoin this ps gm ch))))

    (doRejoin [ps gm ch]
      (let [s (NettyTCPMessageSender. ch) ]
        (.setTcpSender ps s)
        (.connect gm ps)
        (.writeAndFlush ch (EventToFrame OEvents/GAMEROOM_JOIN_OK ))
        (.setWritable ps true)
        (.onEvent ps (ReconnetEvent. s))))

    (doConnect [player ch]
      (if (nil? player)
        (closeOnConnectFailure ch)
        (.writeAndFlush ch (EventToFrame OEvents/LOGIN_OK))))

    (doJoin [player ch refKey]
      (if-let [gm (LookupRoom refKey) ]
        (let [reconnKey (IdGenerator (.getClass player))
              me this
              ps (.createSession gm player reconnKey) ]
          ;;(.setAttr ps Config/RECONNECT_KEY reconnKey)
          (log/debug "sending GAMEROOM_JOIN_OK to channel " ch)
          (-> (.writeAndFlush ch (EventToFrame OEvents/GAMEROOM_JOIN_OK reconnKey))
              (.addListener (reify ChannelFutureListener
                               (operationComplete [_ cff]
                                 (if (.isSuccess ^ChannelFuture cff)
                                   (.connectToRoom me gm ps ch)
                                   (.close ch)))))))
        (do
          (-> (.writeAndFlush ch (EventToFrame OEvents/GAMEROOM_JOIN_NOK ))
              (.addListener ChannelFutureListener/CLOSE))
          (log/error "invalid ref key " refKey " provided by channel " ch))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private WS-HANDLER (makeWebSockHandler))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyWebSockHandler ""

  ^ChannelHandler
  []

  WS-HANDLER)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private connect-eof nil)

