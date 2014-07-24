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
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.
 ??*/

package com.zotohlab.odin.event;

/**
 * @author kenl
 */
public interface Events {

  // Event type
  public static final int PLAYGAME_REQ          = 1;
  public static final int JOINGAME_REQ          = 2;
  public static final int NETWORK_MSG           = 3;
  public static final int SESSION_MSG           = 4;

  // Event code
  public static final int C_PLAYREQ_NOK         = 10;
  public static final int C_JOINREQ_NOK         = 11;
  public static final int C_USER_NOK            = 12;
  public static final int C_GAME_NOK            = 13;
  public static final int C_ROOM_NOK            = 14;
  public static final int C_ROOM_FILLED         = 15;
  public static final int C_ROOMS_FULL          = 16;

  public static final int C_PLAYREQ_OK          = 30;
  public static final int C_JOINREQ_OK          = 31;

  public static final int C_AWAIT_START         = 50;
  public static final int C_START               = 51;
  public static final int C_STOP                = 52;
  public static final int C_POKE_MOVE           = 53;
  public static final int C_POKE_WAIT           = 54;
  public static final int C_PLAYER_JOINED       = 55;

  public static final int C_STARTED             = 95;
  public static final int C_CONNECTED           = 98;
  public static final int C_ERROR               = 99;
  public static final int C_CLOSED              = 100;

  public static final int S_NOT_CONNECTED       = 0;
  public static final int S_CONNECTED           = 1;



}

