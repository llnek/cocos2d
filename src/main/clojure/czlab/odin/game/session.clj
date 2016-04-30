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
      :author "kenl"}

  czlab.odin.game.session

  (:require
    [czlab.xlib.util.core :refer [trap! MubleObj! ]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.str :refer [strim hgl?]])

  (:use [czlab.xlib.util.process]
        [czlab.xlib.util.guids]
        [czlab.odin.system.util]
        [czlab.odin.event.core]
        [czlab.odin.event.disp])

  (:import
    [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
    [com.zotohlab.odin.game Game PlayRoom
    Player PlayerSession]
    [com.zotohlab.frwk.core Hierarchial]
    [com.zotohlab.odin.core Session]
    [io.netty.channel Channel]
    [com.zotohlab.skaro.core Muble Container]
    [com.zotohlab.odin.net MessageSender]
    [com.zotohlab.odin.event Events Msgs Sender Receiver]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayerSession

  ^PlayerSession
  [^PlayRoom room ^Player plyr pnumber]

  (let [impl (MubleObj! {:status Events/S_NOT_CONNECTED
                        :shutting-down false})
        created (System/currentTimeMillis)
        sid (GenerateUID (class Session)) ]
    (reify PlayerSession

      (number [_] pnumber)
      (player [_] plyr)
      (room [_] room)

      Hierarchial

      (parent [_] (.getv impl :parent))

      Sender

      ;; send a message to client
      (sendMsg [this msg]
        (when (and (not (.isShuttingDown this))
                   (.isConnected this))
          (-> ^MessageSender
              (.getv impl :tcp)
              (.sendMsg msg))))

      Receiver

      (onMsg [this evt]
        (trap! Exception "Unexpected onmsg called in PlayerSession."))
        ;;(log/debug "player session " sid " , onmsg called: " evt))

      Session

      (isConnected [this] (= Events/S_CONNECTED (.status this)))

      (isShuttingDown [_] (.getv impl :shutting-down))

      (bind [this options]
        (.setv impl :tcp (ReifyReliableSender (:socket options)))
        (.setv impl :parent (:emitter options))
        (.setStatus this Events/S_CONNECTED))

      (id [_] sid)

      (setStatus [_ s] (.setv impl :status s))
      (status [_] (.getv impl :status))

      (close [this]
        (locking this
          (when (.isConnected this)
            (.setv impl :shutting-down true)
            (when-some [^MessageSender
                       s (.getv impl :tcp)]
              (.shutdown s))
            (.unsetv impl :tcp)
            (.setv impl :shutting-down false)
            (.setv impl :status Events/S_NOT_CONNECTED))))

      Object

      (hashCode [me] (if-some [n (.id me)] (.hashCode n) 31))

      (equals [this obj]
        (if (nil? obj)
          false
          (or (identical? this obj)
              (and (== (.getClass this)
                       (.getClass obj))
                   (== (.id ^Session obj)
                       (.id this)))))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

