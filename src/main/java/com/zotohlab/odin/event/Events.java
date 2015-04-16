// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

package com.zotohlab.odin.event;

/**
 * @author kenl
 */
public interface Events {

  // Event types
  public static final long PLAYGAME_REQ          = 3L;
  public static final long JOINGAME_REQ          = 4L;

  // Event code
  public static final long PLAYREQ_NOK         = 10L;
  public static final long JOINREQ_NOK         = 11L;
  public static final long USER_NOK            = 12L;
  public static final long GAME_NOK            = 13L;
  public static final long ROOM_NOK            = 14L;
  public static final long ROOM_FILLED         = 15L;
  public static final long ROOMS_FULL          = 16L;

  public static final long PLAYREQ_OK          = 30L;
  public static final long JOINREQ_OK          = 31L;

  public static final long AWAIT_START         = 40L;
  public static final long SYNC_ARENA          = 45;
  public static final long POKE_RUMBLE         = 46;

  public static final long RESTART                 = 50L;
  public static final long START               = 51L;
  public static final long STOP                = 52L;
  public static final long POKE_MOVE           = 53L;
  public static final long POKE_WAIT           = 54L;
  public static final long PLAY_MOVE            = 55L;
  public static final long REPLAY         = 56L;

  public static final long QUIT_GAME         = 60L;


  public static final long PLAYER_JOINED       = 90L;
  public static final long STARTED             = 95L;
  public static final long CONNECTED           = 98L;
  public static final long ERROR               = 99L;
  public static final long CLOSED              = 100L;

  public static final long S_NOT_CONNECTED       = 0L;
  public static final long S_CONNECTED           = 1L;



}

