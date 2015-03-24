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

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? juid] ]
        [czlabclj.xlib.util.str :only [strim nsb hgl?] ])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame
                                                    PingWebSocketFrame
                                                    PongWebSocketFrame
                                                    CloseWebSocketFrame]
            [io.netty.channel Channel ChannelHandler
                              ChannelHandlerContext]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.frwk.netty NettyFW SimpleInboundFilter]
            [com.zotohlab.odin.event InvalidEventError
                                     Events EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn DecodeJsonEvent "returns event with socket info attached."

  [^String data socket]

  (log/debug "wsock: received json event: " data)
  (try
    (let [evt (json/read-str data :key-fn keyword) ]
      (when-not (number? (:type evt))
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

  (proxy [SimpleInboundFilter][]
    (channelRead0 [ctx msg]
      (let [ch (.channel ^ChannelHandlerContext ctx) ]
        (condp instance? msg

          ;; TODO: handle closing of socket
          CloseWebSocketFrame
          (log/debug "player session sent us a closed message.")

          TextWebSocketFrame
          (let [^TextWebSocketFrame fr msg
                evt (DecodeJsonEvent (.text fr) ch) ]
            (.onEvent (.room ps)
                      (assoc evt :context ps)))

          PingWebSocketFrame
          (let [^PingWebSocketFrame fr msg
                ct (.content fr) ]
            (.retain ct)
            (.writeAndFlush ch (PongWebSocketFrame. ct)))

          PongWebSocketFrame
          (log/debug "got a pong reply back.")

          nil)))
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
                "ErrorSinkFilter"
                "OdinProtocolHandler" (protocolHandler ps))
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

