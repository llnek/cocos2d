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


package com.zotohlab.odin.game;

import java.util.Map;

/**
 * @author kenl
 */
public interface GameEngine {

  //life cycle of engine
  //1. initialize
  //2. ready
  //3. start/restart
  public void initialize(Object players);
  public Object ready(PlayRoom room);

  public Object restart(Map<?,?> options);
  public Object start(Map<?,?> options);

  public void startRound(Map<?,?> options);
  public void endRound(Object any);

  public void stop();
  public void finz();

  public void update(Object event);
  public Object state();

  public Object container();
}
