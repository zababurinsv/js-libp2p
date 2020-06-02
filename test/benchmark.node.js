'use strict'
/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))

const pWaitFor = require('p-wait-for')

const { createPeerId } = require('./utils/creators/peer')
const Libp2p = require('../src')

const Transport = require('libp2p-tcp')
const Muxer = require('libp2p-mplex')
const Crypto = require('libp2p-secio')
const MulticastDNS = require('libp2p-mdns')

const multiaddr = require('multiaddr')
const { MemoryDatastore } = require('interface-datastore')

describe.only('benchmark', function () {
  this.timeout(30e3)
  let nodes

  const create = async (config = {}) => {
    const peerIds = await createPeerId({ number: 5 })

    nodes = await Promise.all(peerIds.map((peerId) => Libp2p.create({
      peerId,
      config: {
        relay: {
          enabled: true,
          hop: {
            enabled: false
          }
        }
      },
      modules: {
        transport: [Transport],
        streamMuxer: [Muxer],
        connEncryption: [Crypto],
        peerDiscovery: [MulticastDNS]
      },
      config: {
        peerDiscovery: {
          autoDial: true,             // Auto connect to discovered peers (limited by ConnectionManager minPeers)
          // The `tag` property will be searched when creating the instance of your Peer Discovery service.
          // The associated object, will be passed to the service when it is instantiated.
          [MulticastDNS.tag]: {
            interval: 1000,
            enabled: true
          }
          // .. other discovery module options.
        }
      },
      addresses: {
        listen: [multiaddr('/ip4/127.0.0.1/tcp/0')]
      },
      ...config
    })))

    nodes[1].connectionManager.on('peer:connected', () => {
      console.log('connected')
    })

    await Promise.all(nodes.map((node) => node.start()))
  }

  const clearStore = (node) => {
    node.peerStore.addressBook.data.clear()
    node.peerStore.protoBook.data.clear()
    node.peerStore.keyBook.data.clear()
    node.peerStore.metadataBook.data.clear()
  }

  const test = async () => {
    await nodes[4].start()

    const start = Date.now()
    await pWaitFor(() =>
      nodes[0].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[1].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[2].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[3].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[4].connectionManager.connections.size >= nodes.length - 1
    )
    return Date.now() - start
  }

  afterEach(() => Promise.all(nodes.map((node) => node.stop())))


  it('run without persistence', async () => {
    await create({
      datastore: new MemoryDatastore(),
      peerStore: {
        persistence: false,
        threshold: 5
      }
    })

    // wait all peers connected
    await pWaitFor(() =>
      nodes[0].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[1].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[2].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[3].connectionManager.connections.size >= nodes.length - 1 &&
      nodes[4].connectionManager.connections.size >= nodes.length - 1
    )

    console.log('all peers connected')

    await nodes[4].stop()

    await pWaitFor(() =>
      nodes[0].connectionManager.connections.size >= nodes.length - 2 &&
      nodes[1].connectionManager.connections.size >= nodes.length - 2 &&
      nodes[2].connectionManager.connections.size >= nodes.length - 2 &&
      nodes[3].connectionManager.connections.size >= nodes.length - 2
    )

    clearStore(nodes[4])

    console.log('peers disconnected 1')

    const dur = await test()

    console.log('all peers connected', dur)
  })

  it('run with persistence', async () => {
    await create({
      datastore: new MemoryDatastore(),
      peerStore: {
        persistence: true,
        threshold: 5
      }
    })

    // wait all peers connected
    await pWaitFor(() =>
      nodes[0].connectionManager.connections.size >= 4 &&
      nodes[1].connectionManager.connections.size >= 4 &&
      nodes[2].connectionManager.connections.size >= 4 &&
      nodes[3].connectionManager.connections.size >= 4 &&
      nodes[4].connectionManager.connections.size >= 4
    )

    console.log('all peers connected')

    await nodes[4].stop()

    await pWaitFor(() =>
      nodes[0].connectionManager.connections.size >= 3 &&
      nodes[1].connectionManager.connections.size >= 3 &&
      nodes[2].connectionManager.connections.size >= 3 &&
      nodes[3].connectionManager.connections.size >= 3
    )

    clearStore(nodes[4])

    console.log('peers disconnected 1')

    const dur = await test()

    console.log('all peers connected', dur)
  })
})
