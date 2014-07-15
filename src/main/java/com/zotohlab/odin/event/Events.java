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

  public static final int PLAYGAME_REQ = 1;
  public static final int JOINGAME_REQ = 2;
  public static final int QUITGAME_REQ= 3;

  public static final int PLAYGAME_REQ_OK =4;

  public static final int START = 30;
  public static final int STOP = 31;

  public static final int SESSION_MSG = 50;
  public static final int NETWORK_MSG = 51;

  public static final int INVALID_GAME = 80;
  public static final int INVALID_USER = 81;
  public static final int ROOM_FULL=82;
  public static final int ROOM_UNAVAILABLE=83;

  public static final int ROOM_EXCEEDED=86;
  public static final int JOIN_NOK=82;


}

