/*??
// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2014 Cherimoia, LLC. All rights reserved.
 ??*/

package com.zotohlab.odin.handler;

import com.zotohlab.odin.game.PlayRoom;
import com.zotohlab.odin.game.Player;
import com.zotohlab.odin.game.PlayerSession;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * @author kenl
 */
@Sharable
public abstract class WebSocketConnectHandler extends SimpleChannelInboundHandler {

  public abstract void doReconnect(PlayerSession playerSession, Channel channel) throws Exception;
  public abstract void doConnect(Player player, Channel channel) throws Exception;

  public abstract void doReJoin(PlayerSession playerSession, PlayRoom room, Channel channel) throws Exception;
  public abstract void doJoin(Player player, Channel channel, String refKey) throws Exception;

}
