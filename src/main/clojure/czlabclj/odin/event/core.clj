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
      :author "kenl" }

  czlabclj.odin.event.core

  (:require [czlabclj.xlib.util.str :refer [strim nsb hgl?]]
            [czlabclj.xlib.util.core
             :refer
             [TryCR]])

  (:require [clojure.tools.logging :as log])

  (:use [czlabclj.xlib.util.format])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.event Msgs Events EventError]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn EventToFrame "Turn data into websocket frames."

  (^TextWebSocketFrame
    [etype body]
    (EventToFrame etype -1 body))

  (^TextWebSocketFrame
    [evt]
    (EventToFrame (:type evt)
                  (:code evt)
                  (:source evt)))

  (^TextWebSocketFrame
    [etype ecode body]
    (let [b1 {:type etype
              :code -1
              :timestamp (System/currentTimeMillis) }
          b2 (if (nil? body)
               b1
               (assoc b1 :source body))
          evt (if (nil? ecode)
                b2
                (assoc b2 :code ecode)) ]
      (TextWebSocketFrame. (WriteJson evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- decodeJsonEvent ""

  [^String data extraBits]

  (log/debug "decoding json: " data)
  (TryCR
    {:type -1}
    (let [evt (ReadJsonKW data) ]
      (when-not (number? (:type evt))
        (throw (EventError. "Event has no type info.")))
      (merge evt extraBits))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeEvent

  "returns event with socket info attached.
  If error, catch and return it with an invalid type."

  ([^String data extraBits] (decodeJsonEvent data extraBits))
  ([^String data] (DecodeEvent data {})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyEvent ""

  ([eventType ecode ^Object source ^Object ctx]
   (let [base {:timestamp (System/currentTimeMillis)
               :type (int eventType)
               :code (int ecode) }
         e1 (if (nil? source)
              base
              (assoc base :source source)) ]
     (if (nil? ctx)
       e1
       (assoc e1 :context ctx))))

  ([eventType ecode source]
   (ReifyEvent eventType ecode source nil))

  ([eventType ecode]
   (ReifyEvent eventType ecode nil nil)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyNWEvent "Make a Network Event."

  ([ecode source]
   (ReifyNWEvent ecode source true))

  ([ecode source reliable?]
   (-> (ReifyEvent Msgs/NETWORK ecode source)
       (assoc :reliable (true? reliable?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySSEvent "Make a Session Event."

  ([ecode source]
   (ReifySSEvent ecode source nil))

  ([ecode source ctx]
   (ReifyEvent Msgs/SESSION ecode source ctx)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

