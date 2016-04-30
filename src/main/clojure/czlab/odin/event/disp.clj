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

  czlab.odin.event.disp

  (:require
    [czlab.xlib.util.str :refer [strim hgl?]]
    [clojure.core.async :as cas
    :refer
    [close! go go-loop chan >! <! ]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.core :refer [tryc]])

  (:use [czlab.odin.event.core])

  (:import
    [com.zotohlab.odin.event Eventee PubSub]
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
      (log/debug "going to close tcp connection %s" ch)
      (tryc (.close ch)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyDispatcher ""

  ^PubSub
  []

  (let [handlers (ref {})]
    (reify PubSub

      (unsubscribeIfSession [this s]
        (doseq [^Eventee cb (keys @handlers)]
          (when-some [ps (.session cb)]
            (when (identical? ps s)
              (.unsubscribe this cb)))))

      (publish [_ msg]
        (log/debug "pub message ==== %s" msg)
        (doseq [c (vals @handlers)]
          (cas/go (cas/>! c msg))))

      (unsubscribe [_ cb]
        (when-some [c (@handlers cb)]
          (cas/close! c)
          (dosync (alter handlers dissoc cb))))

      (subscribe [_ cb]
        (let [c (cas/chan 4)]
          (dosync (alter handlers assoc cb c))
          (cas/go-loop []
            (if-some [msg (cas/<! c)]
              (let [^Eventee ee cb]
                (when (= (.eventType ee)
                         (int (:type msg)))
                  (.onMsg ee msg))
                (recur))))))

      (shutdown [_]
        (doseq [c (vals @handlers)]
          (cas/close! c))
        (dosync (ref-set handlers {}))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

