;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl"}

  czlabclj.odin.game.session

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.process]
        [czlabclj.xlib.util.guids]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.odin.system.util]
        [czlabclj.odin.event.core]
        [czlabclj.odin.event.disp])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.frwk.core Hierarchial]
            [com.zotohlab.odin.core Session]
            [io.netty.channel Channel]
            [com.zotohlab.frwk.util CoreUtils]
            [com.zotohlab.skaro.core Container]
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
        impl (MakeMMap) ]
    (.setf! impl :status Events/S_NOT_CONNECTED)
    (.setf! impl :shutting-down false)
    (reify PlayerSession

      (number [_] pnumber)
      (player [_] plyr)
      (room [_] room)

      Hierarchial

      (parent [_] (.getf impl :parent))

      Sender

      ;; send a message to client
      (sendMsg [this msg]
        (when (and (not (.isShuttingDown this))
                   (.isConnected this))
          (-> ^MessageSender
              (.getf impl :tcp)
              (.sendMsg msg))))

      Receiver

      (onMsg [this evt]
        (log/debug "player session " sid " , onmsg called: " evt))

      Session

      (isShuttingDown [_] (.getf impl :shutting-down))

      (bind [this options]
        (.setf! impl :tcp (ReifyReliableSender (:socket options)))
        (.setf! impl :parent (:emitter options))
        (.setStatus this Events/S_CONNECTED))

      (id [_] sid)

      (setStatus [_ s] (.setf! impl :status s))
      (status [_] (.getf impl :status))

      (isConnected [_] (= Events/S_CONNECTED
                          (.getf impl :status)))

      (close [this]
        (locking this
          (when (.isConnected this)
            (.setf! impl :shutting-down true)
            (when-let [^MessageSender
                       s (.getf impl :tcp)]
              (.shutdown s))
            (.clrf! impl :tcp)
            (.setf! impl :shutting-down false)
            (.setf! impl :status Events/S_NOT_CONNECTED))))

      Object

      (hashCode [me] (if-let [n (.id me)] (.hashCode n) 31))

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
;;
(def ^:private session-eof nil)

