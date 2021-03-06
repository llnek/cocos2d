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


/**
 * @author kenl
 */
public interface Board {

  public boolean isOver(Object game);
  public int evalScore(Object game);
  public Iterable<?>  getNextMoves(Object game);

  public void unmakeMove(Object game, Object move);
  public void makeMove(Object game, Object move);

  public void switchPlayer(Object game);
  public Object takeSnapshot();
}

