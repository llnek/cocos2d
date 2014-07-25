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
  public static final long PLAYGAME_REQ          = 1L;
  public static final long JOINGAME_REQ          = 2L;
  public static final long NETWORK_MSG           = 3L;
  public static final long SESSION_MSG           = 4L;

  // Event code
  public static final long C_PLAYREQ_NOK         = 10L;
  public static final long C_JOINREQ_NOK         = 11L;
  public static final long C_USER_NOK            = 12L;
  public static final long C_GAME_NOK            = 13L;
  public static final long C_ROOM_NOK            = 14L;
  public static final long C_ROOM_FILLED         = 15L;
  public static final long C_ROOMS_FULL          = 16L;

  public static final long C_PLAYREQ_OK          = 30L;
  public static final long C_JOINREQ_OK          = 31L;

  public static final long C_AWAIT_START         = 50L;
  public static final long C_START               = 51L;
  public static final long C_STOP                = 52L;
  public static final long C_POKE_MOVE           = 53L;
  public static final long C_POKE_WAIT           = 54L;
  public static final long C_PLAYMOVE            = 55L;

  public static final long C_PLAYER_JOINED       = 90L;
  public static final long C_STARTED             = 95L;
  public static final long C_CONNECTED           = 98L;
  public static final long C_ERROR               = 99L;
  public static final long C_CLOSED              = 100L;

  public static final long S_NOT_CONNECTED       = 0L;
  public static final long S_CONNECTED           = 1L;



}

