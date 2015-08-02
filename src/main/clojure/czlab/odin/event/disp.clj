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

  czlab.odin.event.disp

  (:require [czlab.xlib.util.core :refer [tryc]]
            [czlab.xlib.util.str :refer [strim nsb hgl?]])

  (:require [clojure.tools.logging :as log]
            [clojure.core.async :as cas
             :refer
             [close! go go-loop chan >! <! ]])

  (:use [czlab.odin.event.core])

  (:import  [com.zotohlab.odin.event Eventee PubSub]
            [com.zotohlab.odin.net TCPSender]
            [io.netty.channel Channel]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyReliableSender ""

  ^TCPSender
  [^Channel ch]

  (reify TCPSender
    (sendMsg [_ msg] (.writeAndFlush ch (EventToFrame msg)))
    (isReliable [_] true)
    (shutdown [_]
      (log/debug "going to close tcp connection " ch)
      (tryc (.close ch)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyDispatcher ""

  ^PubSub
  []

  (let [handlers (ref {})]
    (reify PubSub

      (unsubscribeIfSession [this s]
        (doseq [^Eventee cb (keys @handlers)]
          (when-let [ps (.session cb)]
            (when (identical? ps s)
              (.unsubscribe this cb)))))

      (publish [_ msg]
        (log/debug "pub message ==== " msg)
        (doseq [c (vals @handlers)]
          (cas/go (cas/>! c msg))))

      (unsubscribe [_ cb]
        (when-let [c (@handlers cb)]
          (cas/close! c)
          (dosync (alter handlers dissoc cb))))

      (subscribe [_ cb]
        (let [c (cas/chan 4)]
          (dosync (alter handlers assoc cb c))
          (cas/go-loop []
            (if-let [msg (cas/<! c)]
              (let [^Eventee ee cb]
                (when (= (.eventType ee)
                         (int (:type msg)))
                  (.onMsg ee msg))
                (recur))))))

      (shutdown [_]
        (doseq [c (vals @handlers)]
          (cas/close! c))
        (dosync (ref-set handlers {}))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

