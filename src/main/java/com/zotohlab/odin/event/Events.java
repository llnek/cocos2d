/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright (c) 2013-2016, Kenneth Leung. All rights reserved. */


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

