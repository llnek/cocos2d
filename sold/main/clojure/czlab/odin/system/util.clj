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

  czlab.odin.system.util

  (:require
    [czlab.xlib.netty.filters :refer [DbgPipelineHandlers]]
    [czlab.xlib.util.str :refer [strim hgl?]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.core
    :refer
    [MubleObj! juid]])

  (:use [czlab.odin.event.core])

  (:import
    [com.zotohlab.odin.game Game PlayRoom
    Player PlayerSession]
    [io.netty.handler.codec.http.websocketx
    TextWebSocketFrame PingWebSocketFrame
    PongWebSocketFrame CloseWebSocketFrame]
    [io.netty.channel Channel ChannelHandler
    ChannelHandlerContext]
    [com.zotohlab.frwk.server Emitter]
    [com.zotohlab.skaro.core Container]
    [com.zotohlab.frwk.netty
    ErrorSinkFilter
    SimpleInboundFilter]
    [com.zotohlab.odin.event EventError Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- odin

  "Odin event handler"

  ^ChannelHandler
  [^PlayerSession ps]

  (proxy [SimpleInboundFilter][]
    (channelRead0 [ctx msg]
      (let [ch (-> ^ChannelHandlerContext
                   ctx
                   (.channel))]
        (condp instance? msg

          CloseWebSocketFrame
          (->> (-> (ReifyNWEvent Events/QUIT_GAME nil)
                   (assoc :context ps))
               (.onMsg (.room ps)))

          TextWebSocketFrame
          (->> (-> ^TextWebSocketFrame msg
                   (.text)
                   (DecodeEvent {:context ps}))
               (.onMsg (.room ps)))

          PingWebSocketFrame
          (let [ct (-> ^PingWebSocketFrame
                       msg
                       (.content)) ]
            (.retain ct)
            (.writeAndFlush ch (PongWebSocketFrame. ct)))

          PongWebSocketFrame
          (log/debug "got a pong reply back")

          nil)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ApplyGameHandler

  "Jiggle the pipeline, replace standard websocket
   handlers with Odin"

  [^PlayerSession ps ^Emitter em
   ^Channel ch]

  (.bind ps {:socket ch :emitter em})
  (let [pipe (.pipeline ch)]
    (.remove pipe "WebSocketServerProtocolHandler")
    (.remove pipe "WS403Responder")
    (.remove pipe "WSOCKDispatcher")
    (.addBefore pipe
                ErrorSinkFilter/NAME
                "OdinProtocolHandler" (odin ps))
    (DbgPipelineHandlers pipe)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GenerateUID ""

  ^String
  [^Class cz]

  (let [id (juid) ]
    (if (nil? cz)
      id
      (str (.getSimpleName cz) "-" id))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

