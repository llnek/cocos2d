;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  cmzlabclj.odin.event.core

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])
  (:use [cmzlabclj.nucleus.util.core
         :only [ThrowUOE MakeMMap ternary test-nonil? notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.event Events InvalidEventError]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn EventToFrame ""

  (^TextWebSocketFrame [evt] (EventToFrame (:type evt) (:source evt)))
  (^TextWebSocketFrame
    [etype body]
    (let [base {:type etype :timestamp (System/currentTimeMillis) }
          evt (if-not (nil? body)
                (assoc base :source body)
                base) ]
      (TextWebSocketFrame. (json/write-str evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeEvent ""

  [^String data]

  (try
    (let [evt (json/read-str data :key-fn keyword) ]
      (when (nil? (:type evt))
        (throw (InvalidEventError. "event object has no type info.")))
      evt)
    (catch Throwable e#
      (log/error e# "")
      {})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyEvent ""

  ([eventType ^Object source] (ReifyEvent eventType source nil))
  ([eventType ^Object source ^Object ctx]
   (let [base {:timestamp (System/currentTimeMillis)
               :type (int eventType) }
         e1 (if-not (nil? source)
              (assoc base :source source)
              base) ]
     (if-not (nil? ctx)
       (assoc e1 :context ctx)
       e1))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyNetworkEvent ""

  ([source] (ReifyNetworkEvent source true))
  ([source reliable?]
   (let [evt (ReifyEvent Events/NETWORK_MSG source) ]
     (assoc evt :reliable (true? reliable?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyConnectEvent ""

  ([tcp udp] (ThrowUOE "only tcp supported."))
  ([tcp]
   (ReifyEvent Events/CONNECT tcp)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySessionMessage ""

  [^Object source]

  (ReifyEvent Events/SESSION_MSG source))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyChangeAttrEvent ""

  [^Object attr ^Object value]

  (ReifyEvent Events/CHANGE_ATTRIBUTE value attr))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onNetMsg ""

  [^Session session evt]

  (if (or (nil? session)
          (not (.isWritable session)))
    nil
    (.sendMessage session evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onData ""

  [^PlayerSession session evt]

  (when-not (nil? session)
    (let [ ne (ReifyNetworkEvent evt) ]
      (when (.isUDPEnabled session)
        (.setReliable ne false))
      (-> session (.getGameRoom)(.sendBroadcast ne)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onConnect ""

  [^Session session ^ConnectEvent evt]

  (when-not (nil? session)
    (let [ ss (.getTCPSender session)
           es (.getTCPSender evt) ]
      (if (notnil? es)
        (.setTCPSender session es)
        (if (nil? ss)
          (log/warn "TCP connection not fully established yet.")
          (do
            (.setUDPEnabled session true)
            (.setUDPSender session (.getUDPSender evt))))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onReconnect

  [^Session session ^ConnectEvent evt]

  ;; To synchronize with task for closing session in ReconnectRegistry service.
  (when-not (nil? session)
    (CoreUtils/syncExec
      session
      (reify Callable
        (call [_]
          (if-let [ ^SessionRegistry reg (.getAttr Config/RECONNECT_REGISTRY) ]
            (when (not= Session/STATUS_CLOSED (.getStatus session))
              (.removeSession reg (.getAttr session Config/RECONNECT_KEY)))))))
    (onConnect session evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onError ""

  [^Session session ^Event evt]

  (when-not (nil? session)
    (.setStatus session Session/STATUS_NOT_CONNECTED)
    (.setWriteable session false)
    ;; will be set to true by udpupstream handler on connect event.
    (.setUDPEnabled session false)
    (let [ ^SessionRegistry rego (.getAttr session Config/RECONNECT_REGISTRY)
           ^String rckey (.getAttr session Config/RECONNECT_KEY) ]
      (if (and (hgl? rckey)
               (notnil? rego))
        (if (nil? (.getSession rego rckey))
          (.putSession rego  rckey session)
          (log/debug "received exception/disconnect event in session; "
                     "puting session in reconnection registry."))
        (do
          (log/debug "received exception/disconnect event in session; "
                     "closing session.")
          (.session close))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySessionEventHandler ""

  ^EventHandler
  [^Session sess]

  (reify SessionEventHandler
    (getEventType [_] Events/ANY)
    (session [_] sess)
    (onEvent [_ evt]
      (case (:type evt)
        (Events/LOGIN_NOK Events/LOGIN_OK)
        (when-not (nil? session)
          (.sendMessage session evt))
        Events/SESSION_MSG
        (onData session evt)
        Events/NETWORK_MSG
        (onNetMsg session evt)
        Events/LOGOUT
        (when-not (nil? session)
          (.close session))
        Events/CONNECT_NOK
        (log/error "connection failed!")
        Events/CONNECT
        (onConnect session evt)
        Events/DISCONNECT
        (onError session evt)
        Events/RECONNECT
        (onReconnect session evt)
        (Events/START Events/STOP)
        (when-not (nil? session)
          (.sendMessage session evt))
        Events/CHANGE
        (when-not (nil? session)
          (.setAttr session (:context evt) (:source evt)))
        Events/ERROR
        (onError session evt)
        ;;else
        (log/warn "Unknown event type")))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

