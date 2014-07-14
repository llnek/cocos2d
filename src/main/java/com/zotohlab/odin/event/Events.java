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

  public static final int PLAY_GAME_REQ = 1;
  public static final int JOIN_GAME_REQ = 2;
  public static final int QUIT_GAME_REQ= 3;

  public static final int START = 30;
  public static final int STOP = 31;

  public static final int SESSION_MSG = 50;
  public static final int NETWORK_MSG = 51;

  public static final int EXCEPTION = 99;


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

