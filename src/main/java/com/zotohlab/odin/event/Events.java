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
public enum Events {
;
  public static final int PROTCOL_VERSION= 1;
  public static final int ANY = 0;

  // actions.
  public static final int DISCONNECT = 2;
  public static final int CONNECT = 3;
  public static final int RECONNECT = 4;

  public static final int GAME_LIST = 5;
  public static final int ROOM_LIST = 6;
  public static final int ROOM_JOIN = 7;
  public static final int ROOM_QUIT = 8;

  public static final int START = 9;
  public static final int STOP = 10;
  public static final int MODIFY = 11;

  public static final int DISCONNECT_NOK = 12;
  public static final int DISCONNECT_OK = 13;
  public static final int CONNECT_NOK = 14;
  public static final int CONNECT_OK = 15;

  public static final int ROOM_NOK = 16;
  public static final int ROOM_OK = 17;
  public static final int JOIN_NOK = 18;
  public static final int JOIN_OK = 19;

  public static final int SESSION_MSG = 20;
  public static final int NETWORK_MSG = 21;

  public static final int EXCEPTION = 22;


  public static Event event(int eventType, Object source)  {
    return event(eventType, source, null);
  }

  public static Event event(int eventType, Object source , Object context)  {
    DefaultEvent event = new DefaultEvent();
    event.setSource(source);
    event.setType(eventType);
    event.setContext(context);
    return event;
  }


}

