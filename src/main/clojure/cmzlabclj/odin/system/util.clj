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

  cmzlabclj.odin.system.util

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? juid] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession Session]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel Channel ChannelHandler
                              ChannelHandlerContext]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.frwk.netty SimpleInboundHandler]
            [com.zotohlab.odin.event InvalidEventError
                                     Events EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeJsonEvent

  [^String data socket]

  (log/debug "received json event: " data)
  (try
    (let [evt (json/read-str data :key-fn keyword) ]
      (when (nil? (:type evt))
        (throw (InvalidEventError. "event object has no type info.")))
      (assoc evt :socket socket))
    (catch Throwable e#
      (log/error e# "")
      {:type -1})
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- protocolHandler ""

  ^ChannelHandler
  [^PlayerSession ps]

  (proxy [SimpleInboundHandler][]
    (channelRead0 [ctx msg]
      (let [ch (.channel ^ChannelHandlerContext ctx)
            ^TextWebSocketFrame w msg
            evt (DecodeJsonEvent (.text w) ch)]
        (.onEvent (.room ps)
                  (assoc evt :context ps))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ApplyProtocol ""

  [^PlayerSession ps
   ^Channel ch]

  (let [pipe (.pipeline ch)]
    (.remove pipe "WebSocketServerProtocolHandler")
    (.remove pipe "WS403Responder")
    (.remove pipe "WSOCKDispatcher")
    (.addBefore pipe
                "ErrorCatcher"
                "OdinProtocolHandler" (protocolHandler ps))
    (.bind ps ch)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GenerateUID ""

  ^String
  [^Class cz]

  (let [id (juid) ]
    (if (nil? cz)
      id
      (str (.getSimpleName cz) "-" id))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private util-eof nil)

