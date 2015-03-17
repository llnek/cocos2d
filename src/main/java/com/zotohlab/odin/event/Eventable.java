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
// Copyright (c) 2014, Ken Leung. All rights reserved.
 ??*/

package com.zotohlab.odin.event;

import com.zotohlab.odin.event.EventHandler;

/**
 * @author kenl
 */
public interface Eventable {

  public void onEvent(Object event);
//  public EventDispatcher getEventDispatcher();

  //public Collection<EventHandler> getHandlers(int eventType);
  public void removeHandler(EventHandler eventHandler);
  public void addHandler(EventHandler eventHandler);
  public void sendMessage(Object msg);


}
