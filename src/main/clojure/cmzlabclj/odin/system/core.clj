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

  cmzlabclj.odin.system.core

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.event.core]
        [cmzlabclj.odin.game.room]
        [cmzlabclj.odin.system.rego])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player PlayerSession Session]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel ChannelHandlerContext ChannelHandler
                              ChannelPipeline Channel]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.frwk.netty SimpleInboundHandler]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.odin.event Events EventDispatcher]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyError ""

  [evt error msg]

  (let [rsp (EventToFrame error (nsb msg))
        ^Channel ch (:socket evt) ]
    (log/debug "replying back an error type " error)
    (.writeAndFlush ch rsp)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyOK ""

  [^PlayerSession ps etype]

  (let [rsp (EventToFrame etype
                          (-> (.room ps)
                              (.roomId))) ]
    (log/debug "player connection request is ok.")
    (.sendMessage ps rsp)
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
            evt (DecodeEvent (.text w) ch)]
        (.onEvent (.room ps)
                  (assoc evt :context ps))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- applyProtocol ""

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
(defn- onPlayReq ""

  [evt]

  (when-let [arr (:source evt)]
    (when (and (vector? arr)
               (= (count arr) 3))
      (with-local-vars [plyr nil
                        gm nil
                        ps nil
                        room nil]
        (let [g (LookupGame (nth arr 0))]
          (if (.supportMultiPlayers g)
            (var-set gm g)
            (replyError evt Events/INVALID_GAME "")))
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (replyError evt Events/INVALID_USER ""))
        (if-let [r (OpenRoom @gm @plyr)]
          (var-set room r)
          (replyError evt Events/ROOM_UNAVAILABLE ""))
        (when (and (notnil? @plyr)
                   (notnil? @gm)
                   (notnil? @room))
          (let [ps (JoinRoom @room @plyr)
                ch (:socket evt)]
            (applyProtocol ps ch)
            (replyOK ps Events/JOINGAME_OK)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onJoinReq ""

  [evt]

  (when-let [arr (:source evt)]
    (when (and (vector? arr)
               (= (count arr) 3))
      (with-local-vars [plyr nil
                        ps nil
                        room nil]
        (if-let [r (LookupRoom (nth arr 0))]
          (let [g (.game r)]
            (if (< (.countPlayers r)
                   (.maxPlayers g))
              (var-set room r)
              (replyError evt Events/ROOM_FULL "")))
          (replyError evt Events/INVALID_GAME ""))
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (replyError evt Events/INVALID_USER ""))
        (when (and (notnil? @plyr)
                   (notnil? @room))
          (let [ps (JoinRoom @room @plyr)
                ch (:socket evt)]
            (applyProtocol ps ch)
            (replyOK ps Events/PLAYGAME_OK)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OdinOnEvent ""

  [evt]

  (let [etype (:type evt)]
    (cond
      (== etype Events/PLAYGAME_REQ)
      (onPlayReq evt)

      (== etype Events/JOINGAME_REQ)
      (onJoinReq evt)

      :else
      (log/warn "unhandled event " evt))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OdinInit ""

  [^Container ctr]

  (let [appDir (.getAppDir ctr)
        fp (File. appDir "conf/odin.conf")
        json (json/read-str (FileUtils/readFileToString fp "utf-8")) ]
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

