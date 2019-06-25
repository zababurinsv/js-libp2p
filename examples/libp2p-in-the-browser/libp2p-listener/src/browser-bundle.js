'use strict'

const WebSockets = require('libp2p-websockets')
const WebSocketStar = require('libp2p-websocket-star')
const Mplex = require('libp2p-mplex')
const SPDY = require('libp2p-spdy')
const SECIO = require('libp2p-secio')
const defaultsDeep = require('@nodeutils/defaults-deep')
const libp2p = require('../../../../')

class Node extends libp2p {
  constructor (_options) {
    const wsstar = new WebSocketStar({ id: _options.peerInfo.id })

    const defaults = {
      modules: {
        transport: [
          WebSockets,
          wsstar
        ],
        streamMuxer: [
          Mplex,
          SPDY
        ],
        connEncryption: [
          SECIO
        ],
        peerDiscovery: [
          wsstar.discovery
        ]
      },
      config: {
        peerDiscovery: {
          autoDial: true,
          websocketStar: {
            enabled: true
          }
        },
        relay: {
          enabled: true,
          hop: {
            enabled: false,
            active: false
          }
        }
      },
      connectionManager: {
        minPeers: 10,
        maxPeers: 100
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

module.exports = Node
