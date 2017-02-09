;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


(ns ^{:doc ""
      :author "kenl" }

  czlab.odin.system.core

  (:require
    [czlab.xlib.util.files :refer [ReadOneFile]]
    [czlab.xlib.util.core :refer [MubleObj! ]]
    [czlab.xlib.util.logging :as log]
    [clojure.java.io :as io]
    [czlab.xlib.util.str :refer [strim hgl?]]
    [czlab.xlib.util.wfs :refer [SimPTask]])

  (:use [czlab.xlib.util.format]
        [czlab.odin.event.core]
        [czlab.odin.game.msgreq])

  (:import
    [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
    [com.zotohlab.wflow WorkFlow Job Activity PTask]
    [com.zotohlab.skaro.io WebSockEvent]
    [com.zotohlab.frwk.io XData]
    [com.zotohlab.frwk.server Emitter]
    [java.io File]
    [io.netty.channel Channel]
    [com.zotohlab.skaro.core Container]
    [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Main entry point.
(defn- odinOnEvent ""

  [^WebSockEvent ws]

  (let [req (->> {:socket (.getSocket ws)
                  :emitter (.emitter ws) }
                 (DecodeEvent (.. ws
                                  getData
                                  stringify))) ]
    (condp = (:type req)
      Events/PLAYGAME_REQ
      (DoPlayReq req)

      Events/JOINGAME_REQ
      (DoJoinReq req)

      (log/warn "unhandled event " req))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; One time init from the MainApp.
(defn OdinInit ""

  [^Container ctr]

  ;;TODO: loading in Odin config file. do something with it?
  (let [s  (->> (io/file (.getAppDir ctr)
                         "conf/odin.conf")
               (ReadOneFile ))
        json (ReadJsonKW s) ]
    (log/info "Odin config= " s)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn Handler ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_ ]
      (SimPTask (fn [^Job j] (odinOnEvent (.event j)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

