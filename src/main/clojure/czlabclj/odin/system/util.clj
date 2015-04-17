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

  czlabclj.odin.system.util

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.core
         :only
         [MakeMMap ternary notnil? juid]]
        [czlabclj.odin.event.core])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [io.netty.handler.codec.http.websocketx
             TextWebSocketFrame PingWebSocketFrame
             PongWebSocketFrame CloseWebSocketFrame]
            [io.netty.channel Channel ChannelHandler
                              ChannelHandlerContext]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.frwk.netty NettyFW SimpleInboundFilter]
            [com.zotohlab.odin.event InvalidEventError
             Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- protocolHandler "Odin event handler."

  ^ChannelHandler
  [^Container ctr ^PlayerSession ps]

  (proxy [SimpleInboundFilter][]
    (channelRead0 [ctx msg]
      (let [ch (-> ^ChannelHandlerContext
                   ctx
                   (.channel))]
        (condp instance? msg

          CloseWebSocketFrame
          (->> (-> (ReifyNWEvent Events/QUIT_GAME nil ps)
                   (assoc :container ctr))
               (.onMsg (.room ps)))

          TextWebSocketFrame
          (->> (-> ^TextWebSocketFrame msg
                        (.text)
                        (DecodeJsonEvent ch)
                        (assoc :context ps)
                        (assoc :container ctr)) 
               (.onMsg (.room ps) ))

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

  [^Container ctr ^PlayerSession ps
   ^Channel ch]

  (let [pipe (.pipeline ch)]
    (.remove pipe "WebSocketServerProtocolHandler")
    (.remove pipe "WS403Responder")
    (.remove pipe "WSOCKDispatcher")
    (.addBefore pipe
                "ErrorSinkFilter"
                "OdinProtocolHandler" (protocolHandler ctr ps))
    (.bind ps ch)
    (NettyFW/dbgPipelineHandlers pipe)
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

