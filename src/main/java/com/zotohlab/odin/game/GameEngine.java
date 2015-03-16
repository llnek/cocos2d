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
// Copyright (c) 2013 Ken Leung. All rights reserved.
 ??*/

package com.zotohlab.odin.game;

import java.util.Map;

/**
 * @author kenl
 */
public interface GameEngine {

  public void initialize(Object players);
  public Object ready(Object room);

  public Object restart(Map<?,?> options);
  public Object start(Map<?,?> options);

  public void startRound(Map<?,?> options);
  public void endRound(Object any);

  public void stop();
  public void finz();

  public void update(Object event);
  public Object state();

  public void onNetworkMsg(Object evt);
  public void onSessionMsg(Object evt);


}
