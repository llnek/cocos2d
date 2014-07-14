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
  public static final byte PROTCOL_VERSION= 1;
  public static final byte ANY = 0;

  // actions.
  public static final byte DISCONNECT = 2;
  public static final byte CONNECT = 3;
  public static final byte RECONNECT = 4;

  public static final byte GAME_LIST = 5;
  public static final byte ROOM_LIST = 6;
  public static final byte ROOM_JOIN = 7;
  public static final byte ROOM_QUIT = 8;

  public static final byte START = 9;
  public static final byte STOP = 10;
  public static final byte MODIFY = 11;

  public static final byte DISCONNECT_NOK = 12;
  public static final byte DISCONNECT_OK = 13;
  public static final byte CONNECT_NOK = 14;
  public static final byte CONNECT_OK = 15;
  public static final byte JOIN_NOK = 16;
  public static final byte JOIN_OK = 17;

  public static final byte SESSION_MSG = 18;
  public static final byte NETWORK_MSG = 19;
  public static final byte EXCEPTION = 99;


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

