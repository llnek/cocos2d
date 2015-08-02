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

  czlab.odin.system.util

  (:require [czlab.xlib.util.str :refer [strim nsb hgl?]]
            [czlab.xlib.netty.filters :refer [DbgPipelineHandlers]]
            [czlab.xlib.util.core
             :refer
             [MakeMMap notnil? juid]])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.odin.event.core])

  (:import  [com.zotohlab.odin.game Game PlayRoom
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
(defn- protocolHandler "Odin event handler."

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
          (log/debug "got a pong reply back.")

          nil)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ApplyGameHandler "Jiggle the pipeline, replace standard websocket
                       handlers with Odin."

  [^PlayerSession ps ^Emitter em
   ^Channel ch]

  (.bind ps {:socket ch :emitter em})
  (let [pipe (.pipeline ch)]
    (.remove pipe "WebSocketServerProtocolHandler")
    (.remove pipe "WS403Responder")
    (.remove pipe "WSOCKDispatcher")
    (.addBefore pipe
                (ErrorSinkFilter/getName)
                "OdinProtocolHandler" (protocolHandler ps))
    (DbgPipelineHandlers pipe)
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
;;EOF

