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

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])
            ;;[clojure.core.async :as async])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ] ]
        [czlabclj.xlib.util.process]
        [czlabclj.xlib.util.guids]
        [czlabclj.xlib.util.str :only [strim nsb hgl?] ]
        [czlabclj.odin.net.senders]
        [czlabclj.odin.event.core]
        [czlabclj.odin.system.util]
        [czlabclj.odin.system.rego])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.core Session$Status Session]
            [io.netty.channel Channel]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.frwk.util CoreUtils]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.odin.net MessageSender]
            [com.zotohlab.odin.event Events
                                     Eventable EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayerSession

  ^PlayerSession
  [^PlayRoom room ^Player plyr pnumber]

  (let [created (System/currentTimeMillis)
        sid (GenerateUID (class Session))
        ;;ch (async/chan (async/sliding-buffer 10))
        impl (MakeMMap) ]
    (.setf! impl :status Session$Status/NOT_CONNECTED)
    (.setf! impl :shutting-down false)
    (reify PlayerSession

      (number [_] pnumber)
      (player [_] plyr)
      (room [_] room)

      Eventable

      ;; send a message to client
      (sendMessage [this msg]
        (when (.isConnected this)
          (let [^MessageSender s (.getf impl :tcp)]
            (.sendMessage s msg))))

      (onEvent [this evt]
        (log/debug "player session " sid " , onevent called: " evt)
        ;; when it is a network msg with a specific socket attached.
        ;; it means only the same socket should apply the message,
        ;; others should ignore - do nothing.
        (when-not (.getf impl :shutting-down)
          (if (and (== Events/NETWORK_MSG (:type evt))
                   (notnil? (:context evt)))
            (when (identical? this
                              (:context evt))
              ;; TODO: check if we really need to do this swapping
              ;; change the type to SESSION_MSG.
              (.sendMessage this
                            (assoc evt
                                   :type Events/SESSION_MSG)))
            (.sendMessage this evt))))

      (removeHandler [_ h] )

      (addHandler [_ h] )
      ;;(getHandlers [_ etype] (.getHandlers disp etype))

      Session

      (isShuttingDown [_] (.getf impl :shutting-down))

      (bind [this soc]
        (.setf! impl :tcp (ReifyReliableSender soc))
        (.setStatus this Session$Status/CONNECTED))

      (id [_] sid)

      (setStatus [_ s] (.setf! impl :status s))
      (getStatus [_] (.getf impl :status))

      (isConnected [_] (= Session$Status/CONNECTED
                          (.getf impl :status)))
      (close [this]
        (locking this
          (when (.isConnected this)
            (.setf! impl :shutting-down true)
            ;;(.close disp)
            (when-let [^MessageSender
                       s (.getf impl :tcp)]
              (.shutdown s))
            (.clrf! impl :tcp)
            (.setf! impl :shutting-down false)
            (.setf! impl :status Session$Status/NOT_CONNECTED))))

      Object

      (hashCode [this]
        (if-let [ n (.id this) ]
          (.hashCode n)
          31))

      (equals [this obj]
        (if (nil? obj)
          false
          (or (identical? this obj)
              (and (= (.getClass this)
                      (.getClass obj))
                   (= (.id ^Session obj)
                      (.id this))))))
    )
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private session-eof nil)

