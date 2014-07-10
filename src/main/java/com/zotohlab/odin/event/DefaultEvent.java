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

import java.io.Serializable;

/**
 * @author kenl
 */
public class DefaultEvent implements Event, Serializable {

  protected EventContext eventContext;
  protected int eventType;
  protected Object eventSource;
  protected long eventTimeStamp;

  public DefaultEvent() {
    eventTimeStamp= System.currentTimeMillis();
  }

  public EventContext context() {
    return eventContext;
  }

  public int type() {
    return eventType;
  }

  public Object source() {
    return eventSource;
  }

  public long timestamp() {
    return eventTimeStamp;
  }

  public void setContext(EventContext context) {
    eventContext = context;
  }

  public void setType(int type) {
    eventType = type;
  }

  public void setSource(Object src) {
    eventSource = src;
  }

  public void setTimeStamp(long timeStamp) {
    eventTimeStamp = timeStamp;
  }

  public String toString() {
    return "Event [type=" + eventType + ", source=" + eventSource + ", timeStamp="
        + eventTimeStamp + "]";
  }

}

