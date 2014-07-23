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
         :only [ThrowUOE MakeMMap ternary test-nonil notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.system.util])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.event Events InvalidEventError]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn EventToFrame ""

  (^TextWebSocketFrame [etype body]
                       (EventToFrame etype -1 body))

  (^TextWebSocketFrame [evt]
                       (EventToFrame (:type evt)
                                     (:code evt)
                                     (:source evt)))

  (^TextWebSocketFrame [etype ecode body]
                       (let [b1 {:type etype :code -1
                                 :timestamp (System/currentTimeMillis) }
                             b2 (if-not (nil? body)
                                  (assoc b1 :source body)
                                  b1)
                             evt (if-not (nil? ecode)
                                   (assoc b2 :code ecode)
                                   b2) ]
                         (TextWebSocketFrame. ^String (json/write-str evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeEvent ""

  [^String data socket]

  (DecodeJsonEvent data socket))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyEvent ""

  ([eventType ecode ^Object source]
   (ReifyEvent eventType ecode source nil))

  ([eventType ecode]
   (ReifyEvent eventType ecode nil nil))

  ([eventType ecode ^Object source ^Object ctx]
   (let [base {:timestamp (System/currentTimeMillis)
               :type (int eventType)
               :code (int ecode) }
         e1 (if-not (nil? source)
              (assoc base :source source)
              base) ]
     (if-not (nil? ctx)
       (assoc e1 :context ctx)
       e1))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyNetworkEvent ""

  ([ecode source] (ReifyNetworkEvent ecode source true))
  ([ecode source reliable?]
   (let [evt (ReifyEvent Events/NETWORK_MSG ecode source) ]
     (assoc evt :reliable (true? reliable?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySessionMessage ""

  [ecode ^Object source]

  (ReifyEvent Events/SESSION_MSG ecode source))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

