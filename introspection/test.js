'use strict'

const createNode = require('../test/utils/create-node')

const introspection = async () => {
  let libp2pNode

  // Start node
  await new Promise((resolve, reject) => {
    createNode('/ip4/0.0.0.0/tcp/0', {
      config: {
        peerDiscovery: {
          bootstrap: {
            interval: 100,
            enabled: true,
            list: [
              '/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
              '/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
              '/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
              '/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
              '/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
              '/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
              '/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
              '/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
              '/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
              '/ip6/2604:a880:1:20::1f9:9001/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z',
              '/ip6/2604:a880:1:20::203:d001/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
              '/ip6/2604:a880:0:1010::23:d001/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
              '/ip6/2400:6180:0:d0::151:6001/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
              '/ip6/2604:a880:800:10::4a:5001/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
              '/ip6/2a03:b0c0:0:1010::23:1001/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
              '/ip6/2a03:b0c0:1:d0::e7:1/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
              '/ip6/2604:a880:1:20::1d9:6001/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx',
              '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
              '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6'
            ]
          },
          mdns: {
            interval: 100,
            enabled: true
          }
        }
      }
    }, (err, node) => {
      if (err) {
        reject(err)
      }

      libp2pNode = node

      libp2pNode.start((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })

  libp2pNode.on('peer:discovery', (peerInfo) => {
    const noop = () => { }

    peerInfo = libp2pNode.peerBook.put(peerInfo)
    if (!peerInfo.isConnected()) {
      libp2pNode.dial(peerInfo, noop)
    }
  })

  await new Promise(resolve => setTimeout(resolve, 15000))

  // Intropsection
  const data = libp2pNode.introspection.host()

  // console.log('conns', data.subsystems.swarm.conns)

  const conns = libp2pNode._switch.connection.connections
  const connsPeers = Object.keys(conns)

  connsPeers.forEach((key) => {
    const conn = conns[key][0]

    console.log(conn.muxer.multiplex._list.filter((m) => !!m))
  })

  const encodedData = libp2pNode.introspection.marshal(data)
  const decodedData = libp2pNode.introspection.unmarshal(encodedData)

  console.log('dec', decodedData)

  // Stop node
  await new Promise((resolve, reject) => {
    libp2pNode.stop((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  console.log('all done')
  process.exit()
}

introspection()

/*
TODO:

- WebSockets transports with empty listen_multiaddrs
*/
