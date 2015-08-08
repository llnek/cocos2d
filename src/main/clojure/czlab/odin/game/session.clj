;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2015, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl"}

  czlab.odin.game.session

  (:require [czlab.xlib.util.core :refer [MakeMMap notnil? ]]
            [czlab.xlib.util.str :refer [strim nsb hgl?]])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.xlib.util.process]
        [czlab.xlib.util.guids]
        [czlab.odin.system.util]
        [czlab.odin.event.core]
        [czlab.odin.event.disp])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
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

  (let [created (System/currentTimeMillis)
        sid (GenerateUID (class Session))
        impl (MakeMMap {:status Events/S_NOT_CONNECTED
                        :shutting-down false}) ]
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
        (throw (Exception. "Unexpected onmsg called in PlayerSession.")))
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
                       (.id this))))))
  )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

