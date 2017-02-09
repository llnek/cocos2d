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

  czlab.odin.event.core

  (:require
    [czlab.xlib.util.str :refer [strim hgl?]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.core
    :refer
    [trap! trycr]])

  (:use [czlab.xlib.util.format])

  (:import
    [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
    [com.zotohlab.odin.event Msgs Events EventError]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn EventToFrame

  "Turn data into websocket frames"

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

  (log/debug "decoding json: %s" data)
  (trycr
    {:type -1}
    (let [evt (ReadJsonKW data) ]
      (when-not (number? (:type evt))
        (trap! EventError "Event has no type info."))
      (merge evt extraBits))))

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
(defn ReifyNWEvent

  "Make a Network Event"

  ([ecode source]
   (ReifyNWEvent ecode source true))

  ([ecode source reliable?]
   (-> (ReifyEvent Msgs/NETWORK ecode source)
       (assoc :reliable (true? reliable?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySSEvent

  "Make a Session Event"

  ([ecode source]
   (ReifySSEvent ecode source nil))

  ([ecode source ctx]
   (ReifyEvent Msgs/SESSION ecode source ctx)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

