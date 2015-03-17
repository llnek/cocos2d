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

package com.zotohlab.odin.core;


/**
 * @author kenl
 */
public interface Session {

  enum Status {
    NOT_CONNECTED,
    CONNECTED
  };

  public Object id();

  public void setStatus(Status status);
  public Status getStatus();

  public boolean isShuttingDown();
  public boolean isConnected();

  public void bind(Object impl);
  public void close();

}

