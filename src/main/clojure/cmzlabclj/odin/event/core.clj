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
      :author "kenl" }

  cmzlabclj.odin.event.core

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.xlib.util.core
         :only [ThrowUOE MakeMMap ternary test-nonil notnil? ] ]
        [cmzlabclj.xlib.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.system.util])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.event Events InvalidEventError]))

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
      (TextWebSocketFrame. ^String
                           (json/write-str evt)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeEvent ""

  [^String data socket]

  (DecodeJsonEvent data socket))

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
(defn ReifyNetworkEvent "Make a Network Event."

  ([ecode source]
   (ReifyNetworkEvent ecode source true))

  ([ecode source reliable?]
   (-> (ReifyEvent Events/NETWORK_MSG ecode source)
       (assoc :reliable (true? reliable?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySessionMessage "Make a Session Event."

  ([ecode source]
   (ReifySessionMessage ecode source nil))

  ([ecode source ctx]
   (ReifyEvent Events/SESSION_MSG ecode source ctx)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

