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
// Copyright (c) 2014 Cherimoia, LLC. All rights reserved.
 ??*/


package com.zotohlab.odin.event;

/**
 * @author kenl
 */
public class DefaultNetworkEvent extends DefaultEvent implements NetworkEvent {

  private boolean reliable= true;

  public DefaultNetworkEvent() {
    super.setType(Events.NETWORK_MSG);
  }

  public DefaultNetworkEvent(Event event) {
    this(event, true);
  }

  public DefaultNetworkEvent(Event event, boolean isReliable) {
    this();
    this.setTimeStamp(event.timestamp());
    this.setSource(event.source());
    this.setContext(event.context());
    this.reliable=isReliable;
  }

  public boolean isReliable() {
    return reliable;
  }

  public void setReliable(boolean b) {
    this.reliable=b;
  }

  @Override
  public void setType(int type) {
    throw new IllegalArgumentException(
        "Event type of this class is already set to NETWORK_MESSAGE. "
            + "It cannot be reset.");
  }

}
