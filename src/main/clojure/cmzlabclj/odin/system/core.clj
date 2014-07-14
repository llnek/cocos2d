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
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.event.core]
        [cmzlabclj.odin.system.rego])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player PlayerSession Session]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel Channel]
            [com.zotohlab.odin.event Events EventDispatcher]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyError ""

  [evt error msg]

  (let [rsp (EventToFrame error (nsb msg))
        ^Channel ch (:socket evt) ]
    (.writeAndFlush ch rsp)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyOK ""

  [evt]

  (let [rsp (EventToFrame Events/CONNECT_OK nil)
        ^Channel ch (:socket evt) ]
    (log/debug "player connection request is ok.")
    (.writeAndFlush ch rsp)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onConnectEvent ""

  [evt]

  (when-let [arr (:source evt)]
    (when (and (vector? arr)
               (= (count arr) 3))
      (with-local-vars [plyr nil
                        ps nil
                        room nil]
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (replyError evt Events/CONNECT_NOK "no such player."))
        (if-let [r (LookupRoom (nth arr 0))]
          (var-set room r)
          (replyError evt Events/ROOM_NOK "no such room."))
        (if-let [s (JoinRoom room plyr)]
          (var-set ps s)
          (replyError evt Events/JOIN_NOK "failed to join room."))
        (when (and (notnil? @plyr)
                   (notnil? @ps)
                   (notnil? @room))
          ;;(InitSession @ps evt)
          (replyOK evt))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OdinOnEvent ""

  [evt]

  (let [etype (:type evt)]
    (cond
      (== etype Events/CONNECT)
      (onConnectEvent evt)

      :else
      (log/warn "unhandled event " evt))))








;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

