import React from 'react'
import { expect } from 'chai'
import { spy } from 'sinon'
import { getState, seedState, updateState, listen, middleware, silence, underwear, State } from './../src/main'

describe('duxanator', function () {
  afterEach(function () {
    seedState({})
  })

  describe('with a nested object state', () => {
    beforeEach(() => {
      seedState({
        comments: {}
      })
    })

    describe('#updateState', () => {
      it('updates the state', () => {
        updateState((state) => {
          return {
            ...state.comments,
            comments: {1: {}}
          }
        })

        expect(getState())
          .to.eql({
            comments: {
              1: {}
            }
          })
      })
    })
  })

  describe('getState', function () {
    it('is a function', function () {
      expect(getState)
        .to.be.a('function')
    })

    describe('when no function is provided', function () {
      it('returns the current state', function () {
        expect(getState())
          .to.be.eql({})
      })
    })

    describe('when a function is provided', function () {
      let pluck = (state) => {
        state.working = true
        return state
      }

      it('returns result of the function', function () {
        expect(getState(pluck))
          .to.be.eql({ working: true })
      })
    })
  })

  describe('seedState', function () {
    it('is a function', function () {
      expect(seedState)
        .to.be.a('function')
    })

    it('clones the new state', function () {
      const state = { testing: true }

      seedState(seedState)

      expect(getState())
        .to.not.eql(state)
    })
  })

  describe('listen', function () {
    it('returns the id of the listener', function () {
      expect(listen(() => true))
        .to.be.a('string')
    })
  })

  describe('silence', function () {
    it('returns true if the listener is removed', function () {
      const id = listen(() => true)

      expect(silence(id))
        .to.be.ok
    })
  })

  describe('middleware', function () {
    it('returns the id of the listener', function () {
      expect(middleware(() => true))
        .to.be.ok
    })
  })

  describe('underwear', function () {
    it('returns true if the listener is removed', function () {
      const id = middleware(() => true)

      expect(underwear(id))
        .to.be.ok
    })
  })

  describe('updateState', function () {
    let listenerSpy, middlewareSpy

    beforeEach(() => {
      listenerSpy = spy()
      middlewareSpy = spy()
    })

    it('calls the middleware functions with the newState and meta data', function () {
      const stateUpdate = { testing: 'yep' }
      const meta = { meta: 'so meta' }

      middleware(middlewareSpy, meta)

      updateState((state) => (stateUpdate), meta)

      expect(middlewareSpy.calledWith(stateUpdate, meta))
        .to.be.ok
    })

    it('calls the listener functions with the newState and meta data', function () {
      const stateUpdate = { testing: 'yep' }
      const meta = { meta: 'so meta' }

      listen(listenerSpy)

      updateState((state) => stateUpdate, meta)

      expect(listenerSpy.calledWith(stateUpdate, meta))
        .to.be.ok
    })

    it('clones the new state onto the old state', function () {
      const stateUpdate = { testing: 'yep' }

      updateState((state) => stateUpdate)

      expect(getState)
        .to.not.equal(stateUpdate)
    })
  })

  describe('Deep merge', () => {
    const something = 'something'
    const name = 'name'

    beforeEach(() => {
      seedState({
        user: {
          something
        },
        password: {},
        otherStuff: {
          someMoreStuff: {}
        }
      })
    })
    it('deep merges state', () => {
      updateState((state) => {
        return {
          user: {
            ...state.user,
            name
          }
        }
      })

      const state = getState()

      expect(state.user.name)
        .to.eql(name)

      expect(state.user.something)
        .to.eql(something)
    })
  })

  describe('State component', function () {
    const state = { user: { username: '' } }
    let component, pluckSpy

    beforeEach(() => {
      pluckSpy = spy((x) => x.user)
      seedState(state)
      component = new State({ pluck: pluckSpy })
    })

    it('calls the pluck prop with the current state', function () {
      expect(pluckSpy.firstCall.args[0])
        .to.eql(state)
    })

    it('calls the pluck prop when state is updated', function () {
      updateState((state) => ({user: {username: 'asd'}}))
      expect(pluckSpy.secondCall.args[0])
        .to.eql({ user: { username: 'asd' } })
    })

    describe('shouldComponentUpdate', function () {
      beforeEach(() => {
        component = new State({ pluck: (x) => x.user })
      })
      it('returns true when nextState doesnt match the current state', function () {
        const result = component.shouldComponentUpdate(null, {})
        expect(result)
          .to.be.true
      })

      it('returns false when nextState does match the current state', function () {
        const result = component.shouldComponentUpdate(null, state)
        expect(result)
          .to.be.false
      })

      it('time test', function () {
        const largeState = {
          things: [
            {
              '_id': '579a79b0dc9b548f3aa1b41a',
              'index': 0,
              'guid': '7fe571fe-7c35-46aa-ac6f-b750afaa977f',
              'isActive': true,
              'balance': '$2,775.13',
              'picture': 'http://placehold.it/32x32',
              'age': 27,
              'eyeColor': 'green',
              'name': 'Bradford Greer',
              'gender': 'male',
              'company': 'ECOLIGHT',
              'email': 'bradfordgreer@ecolight.com',
              'phone': '+1 (977) 426-3960',
              'address': '620 Bennet Court, Omar, Iowa, 8357',
              'about': 'Deserunt culpa aute proident quis incididunt Lorem. Incididunt proident eiusmod cillum ex. Ad laboris deserunt est ullamco incididunt pariatur do cupidatat eiusmod. Pariatur adipisicing ad qui ea exercitation magna sint deserunt mollit ut consectetur exercitation irure do. Quis ipsum consectetur laboris ad cillum ullamco laboris sunt nostrud laboris.\r\n',
              'registered': '2014-05-13T01:32:19 -10:00',
              'latitude': -29.922751,
              'longitude': -149.929796,
              'tags': [
                'ad',
                'dolore',
                'veniam',
                'incididunt',
                'commodo',
                'aliqua',
                'duis'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Occaecat occaecat quis veniam cillum veniam consequat dolore amet. Veniam anim labore minim aute cupidatat consectetur minim pariatur ad. Velit anim officia exercitation occaecat incididunt dolore est laborum duis occaecat veniam laborum. Exercitation mollit ullamco est commodo nisi et id et amet dolor ex labore. Aliqua ullamco ut ut exercitation sint quis.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Byers Lyons'
                },
                {
                  'id': 1,
                  'name': 'Celina Harmon'
                },
                {
                  'id': 2,
                  'name': 'Hale Stewart'
                }
              ],
              'greeting': 'Hello, Bradford Greer! You have 8 unread messages.',
              'favoriteFruit': 'strawberry'
            },
            {
              '_id': '579a79b0a364b07bdefde6fa',
              'index': 1,
              'guid': '55e6c0ee-0731-4a61-ae47-b43596886c7b',
              'isActive': false,
              'balance': '$1,676.67',
              'picture': 'http://placehold.it/32x32',
              'age': 22,
              'eyeColor': 'blue',
              'name': 'Bowman Acosta',
              'gender': 'male',
              'company': 'ZERBINA',
              'email': 'bowmanacosta@zerbina.com',
              'phone': '+1 (877) 426-2691',
              'address': '210 Cove Lane, Nile, Maine, 7013',
              'about': 'Reprehenderit minim exercitation cillum culpa irure amet nisi est anim proident. Elit nostrud adipisicing nostrud in reprehenderit quis velit laborum laboris nostrud occaecat exercitation. Veniam amet voluptate aute ullamco deserunt officia id labore. Culpa incididunt tempor officia consequat qui deserunt ex esse cillum. Magna quis do deserunt veniam sit enim et ipsum elit magna consectetur et.\r\n',
              'registered': '2015-08-20T10:38:14 -10:00',
              'latitude': -40.606308,
              'longitude': 14.421251,
              'tags': [
                'fugiat',
                'enim',
                'et',
                'exercitation',
                'id',
                'proident',
                'fugiat'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Magna quis ullamco sint pariatur culpa. Anim minim reprehenderit fugiat amet. Tempor exercitation esse enim sunt elit pariatur officia ad magna elit nulla veniam. Aliqua ex proident commodo deserunt id consequat et ut eu. Pariatur ipsum est exercitation officia exercitation deserunt sit cupidatat.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Dickson Herman'
                },
                {
                  'id': 1,
                  'name': 'Hester Serrano'
                },
                {
                  'id': 2,
                  'name': 'Tran Bishop'
                }
              ],
              'greeting': 'Hello, Bowman Acosta! You have 6 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b07f36215fffda83ca',
              'index': 2,
              'guid': 'b73a4045-c8a0-467f-b6df-115b0c603fe6',
              'isActive': true,
              'balance': '$2,363.24',
              'picture': 'http://placehold.it/32x32',
              'age': 25,
              'eyeColor': 'blue',
              'name': 'Gwen Miles',
              'gender': 'female',
              'company': 'DIGITALUS',
              'email': 'gwenmiles@digitalus.com',
              'phone': '+1 (874) 499-2813',
              'address': '550 Bedford Place, Boonville, Michigan, 5998',
              'about': 'Ad aute id ex irure veniam tempor aliquip aute occaecat non qui nisi aute aliqua. Deserunt deserunt minim et qui ut. Reprehenderit elit ullamco in incididunt. Consectetur aliqua velit nostrud eu reprehenderit occaecat minim sunt cillum nisi exercitation incididunt veniam consequat. Consequat eu non sint Lorem sit nulla mollit mollit pariatur nulla aute exercitation ut.\r\n',
              'registered': '2015-07-24T04:20:35 -10:00',
              'latitude': -46.681625,
              'longitude': 93.787359,
              'tags': [
                'qui',
                'non',
                'officia',
                'sunt',
                'nisi',
                'est',
                'ipsum'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Deserunt amet esse amet laboris adipisicing ea quis culpa labore. Nulla anim amet consequat elit dolore aute eiusmod ullamco et culpa aliqua voluptate. Pariatur cillum culpa veniam Lorem duis id aliquip tempor sint Lorem quis ullamco ut. Eiusmod magna in reprehenderit voluptate amet aliquip. Commodo tempor ullamco occaecat occaecat exercitation ad id nisi ex exercitation aute do dolore qui. Aliquip non laborum ipsum laboris voluptate irure amet non qui.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Carver Carpenter'
                },
                {
                  'id': 1,
                  'name': 'Collier Graham'
                },
                {
                  'id': 2,
                  'name': 'Franco Rivas'
                }
              ],
              'greeting': 'Hello, Gwen Miles! You have 1 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b08ce8d23a66d74c9b',
              'index': 3,
              'guid': '26e534bc-ee59-407d-b7e4-a1145b69a16f',
              'isActive': true,
              'balance': '$2,220.69',
              'picture': 'http://placehold.it/32x32',
              'age': 34,
              'eyeColor': 'brown',
              'name': 'Mcdaniel Frazier',
              'gender': 'male',
              'company': 'CRUSTATIA',
              'email': 'mcdanielfrazier@crustatia.com',
              'phone': '+1 (949) 507-3241',
              'address': '693 McClancy Place, Lindisfarne, Minnesota, 3771',
              'about': 'Dolor ex officia aute occaecat veniam irure laborum nulla tempor sint. Elit Lorem consectetur ex aliqua culpa reprehenderit ad quis exercitation aliqua consequat voluptate. Sunt commodo officia quis cillum aliquip aliqua aliquip ut. Ex sit consequat qui adipisicing ut laborum veniam irure elit esse. Do sint culpa ipsum mollit aute qui ex mollit duis duis. Incididunt sit eiusmod elit sit eiusmod. Elit ea reprehenderit exercitation et adipisicing reprehenderit ipsum cupidatat quis nulla.\r\n',
              'registered': '2014-11-12T10:21:10 -11:00',
              'latitude': -1.320696,
              'longitude': 72.068919,
              'tags': [
                'ipsum',
                'magna',
                'cupidatat',
                'voluptate',
                'proident',
                'reprehenderit',
                'velit'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Culpa nostrud et laborum qui nisi ad sint ea. Ut dolor amet aliqua eiusmod cillum aliquip nostrud tempor ad id cupidatat exercitation aliqua est. Ut ad amet qui eiusmod esse adipisicing fugiat fugiat ullamco ullamco deserunt. Magna eu labore cillum aute aliqua velit in consequat. Aliqua adipisicing aliqua exercitation eu. Esse ea culpa pariatur reprehenderit sit laborum minim commodo velit velit eiusmod sunt deserunt laboris.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Pittman Sparks'
                },
                {
                  'id': 1,
                  'name': 'Cooley Fitzpatrick'
                },
                {
                  'id': 2,
                  'name': 'Burgess Rivera'
                }
              ],
              'greeting': 'Hello, Mcdaniel Frazier! You have 7 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b086cbbe17295d9454',
              'index': 4,
              'guid': 'bac74a45-5d23-4e06-9160-51f44330c578',
              'isActive': true,
              'balance': '$3,507.23',
              'picture': 'http://placehold.it/32x32',
              'age': 33,
              'eyeColor': 'brown',
              'name': 'Schwartz Hensley',
              'gender': 'male',
              'company': 'ASSURITY',
              'email': 'schwartzhensley@assurity.com',
              'phone': '+1 (804) 452-2975',
              'address': '986 Gerald Court, Laurelton, Colorado, 1035',
              'about': 'Nulla non culpa qui nulla. Elit excepteur laborum anim reprehenderit qui dolor dolor. Minim do aliqua velit eiusmod adipisicing. Consequat cupidatat duis eiusmod pariatur nulla ipsum duis ipsum proident ad do. Ad tempor officia ex ea officia.\r\n',
              'registered': '2015-10-15T06:49:59 -11:00',
              'latitude': -82.640929,
              'longitude': 30.846681,
              'tags': [
                'fugiat',
                'incididunt',
                'magna',
                'et',
                'amet',
                'est',
                'nostrud'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Voluptate fugiat exercitation nulla duis culpa eiusmod voluptate reprehenderit sit non. Incididunt cupidatat eiusmod nulla nisi labore fugiat esse ea do elit excepteur non. Et do duis sunt aute est commodo non.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Baker Gilbert'
                },
                {
                  'id': 1,
                  'name': 'Holmes Farrell'
                },
                {
                  'id': 2,
                  'name': 'Eula Mccray'
                }
              ],
              'greeting': 'Hello, Schwartz Hensley! You have 10 unread messages.',
              'favoriteFruit': 'apple'
            },
            {
              '_id': '579a79b0e062b2108a9ca1cc',
              'index': 5,
              'guid': '0b3a55d1-7754-4469-a6da-1940701f89c5',
              'isActive': false,
              'balance': '$1,231.39',
              'picture': 'http://placehold.it/32x32',
              'age': 37,
              'eyeColor': 'blue',
              'name': 'Shauna Decker',
              'gender': 'female',
              'company': 'PARLEYNET',
              'email': 'shaunadecker@parleynet.com',
              'phone': '+1 (869) 474-3658',
              'address': '695 Blake Court, Trexlertown, Tennessee, 2128',
              'about': 'Do enim deserunt eiusmod enim cupidatat eu anim elit do velit. Voluptate id elit voluptate sunt. Nulla sint quis Lorem aliquip. Magna enim sit ut qui et sunt nisi reprehenderit Lorem. In dolore dolore non ex esse aliqua minim esse. Velit veniam id elit qui qui consectetur officia nulla non reprehenderit dolor commodo consectetur duis. Cupidatat pariatur eu velit amet exercitation nulla id in exercitation minim.\r\n',
              'registered': '2016-07-25T09:37:06 -10:00',
              'latitude': 10.081668,
              'longitude': -112.750664,
              'tags': [
                'sunt',
                'sunt',
                'ullamco',
                'irure',
                'anim',
                'ullamco',
                'enim'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Et eu nisi magna esse cillum tempor dolor voluptate. Laborum magna exercitation dolore mollit veniam eiusmod enim aliquip. Dolor anim et culpa consectetur sint do eiusmod cupidatat nostrud irure commodo.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Shelly Rios'
                },
                {
                  'id': 1,
                  'name': 'Melba Lambert'
                },
                {
                  'id': 2,
                  'name': 'Figueroa Mcdonald'
                }
              ],
              'greeting': 'Hello, Shauna Decker! You have 2 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b06dbe6d4fe13192aa',
              'index': 6,
              'guid': '6ae011b9-b532-4ed1-913a-2724943ed251',
              'isActive': false,
              'balance': '$3,551.59',
              'picture': 'http://placehold.it/32x32',
              'age': 34,
              'eyeColor': 'blue',
              'name': 'Debora Slater',
              'gender': 'female',
              'company': 'EXOTERIC',
              'email': 'deboraslater@exoteric.com',
              'phone': '+1 (841) 583-3557',
              'address': '905 Wythe Place, Wyano, Washington, 5223',
              'about': 'Eu labore deserunt magna in. Veniam minim laborum ut fugiat sit laborum esse excepteur anim dolor fugiat cillum. Consectetur laboris nulla aliquip tempor consequat commodo proident sunt nostrud officia aliquip aliqua. Elit labore occaecat duis dolor voluptate dolore.\r\n',
              'registered': '2015-03-13T12:57:16 -11:00',
              'latitude': 19.909618,
              'longitude': -83.213278,
              'tags': [
                'non',
                'nostrud',
                'irure',
                'qui',
                'exercitation',
                'sint',
                'incididunt'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Cillum mollit aute laboris ullamco veniam consequat pariatur voluptate mollit. Eiusmod dolore id magna ullamco exercitation ex laborum ullamco incididunt minim id deserunt est. Quis ex pariatur occaecat incididunt sunt ad aute amet tempor cupidatat officia anim.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Ellen Mckee'
                },
                {
                  'id': 1,
                  'name': 'Mack Shaffer'
                },
                {
                  'id': 2,
                  'name': 'Gena Carter'
                }
              ],
              'greeting': 'Hello, Debora Slater! You have 7 unread messages.',
              'favoriteFruit': 'apple'
            }
          ]
        }
        seedState(largeState)
        const component = new State({ pluck: (x) => x.things[0].deep })

        const anotherDifferentState = {
          things: [
            {
              '_id': '579a79b0dc9b548f3aa1b41a',
              'index': 0,
              'guid': '7fe571fe-7c35-46aa-ac6f-b750afaa977f',
              'isActive': true,
              'balance': '$2,775.13',
              'picture': 'http://placehold.it/32x32',
              'age': 27,
              'eyeColor': 'green',
              'name': 'Bradford Greer',
              'gender': 'male',
              'company': 'ECOLIGHT',
              'email': 'bradfordgreer@ecolight.com',
              'phone': '+1 (977) 426-3960',
              'address': '620 Bennet Court, Omar, Iowa, 8357',
              'about': 'Deserunt culpa aute proident quis incididunt Lorem. Incididunt proident eiusmod cillum ex. Ad laboris deserunt est ullamco incididunt pariatur do cupidatat eiusmod. Pariatur adipisicing ad qui ea exercitation magna sint deserunt mollit ut consectetur exercitation irure do. Quis ipsum consectetur laboris ad cillum ullamco laboris sunt nostrud laboris.\r\n',
              'registered': '2014-05-13T01:32:19 -10:00',
              'latitude': -29.922751,
              'longitude': -149.929796,
              'tags': [
                'ad',
                'dolore',
                'veniam',
                'incididunt',
                'commodo',
                'aliqua',
                'duis'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Occaecat occaecat quis veniam cillum veniam consequat dolore amet. Veniam anim labore minim aute cupidatat consectetur minim pariatur ad. Velit anim officia exercitation occaecat incididunt dolore est laborum duis occaecat veniam laborum. Exercitation mollit ullamco est commodo nisi et id et amet dolor ex labore. Aliqua ullamco ut ut exercitation sint quis.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Byers Lyons'
                },
                {
                  'id': 1,
                  'name': 'Celina Harmon'
                }
              ],
              'greeting': 'Hello, Bradford Greer! You have 8 unread messages.',
              'favoriteFruit': 'strawberry'
            },
            {
              '_id': '579a79b0a364b07bdefde6fa',
              'index': 1,
              'guid': '55e6c0ee-0731-4a61-ae47-b43596886c7b',
              'isActive': false,
              'balance': '$1,676.67',
              'picture': 'http://placehold.it/32x32',
              'age': 22,
              'eyeColor': 'blue',
              'name': 'Bowman Acosta',
              'gender': 'male',
              'company': 'ZERBINA',
              'email': 'bowmanacosta@zerbina.com',
              'phone': '+1 (877) 426-2691',
              'address': '210 Cove Lane, Nile, Maine, 7013',
              'about': 'Reprehenderit minim exercitation cillum culpa irure amet nisi est anim proident. Elit nostrud adipisicing nostrud in reprehenderit quis velit laborum laboris nostrud occaecat exercitation. Veniam amet voluptate aute ullamco deserunt officia id labore. Culpa incididunt tempor officia consequat qui deserunt ex esse cillum. Magna quis do deserunt veniam sit enim et ipsum elit magna consectetur et.\r\n',
              'registered': '2015-08-20T10:38:14 -10:00',
              'latitude': -40.606308,
              'longitude': 14.421251,
              'tags': [
                'fugiat',
                'enim',
                'et',
                'exercitation',
                'id',
                'proident',
                'fugiat'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Magna quis ullamco sint pariatur culpa. Anim minim reprehenderit fugiat amet. Tempor exercitation esse enim sunt elit pariatur officia ad magna elit nulla veniam. Aliqua ex proident commodo deserunt id consequat et ut eu. Pariatur ipsum est exercitation officia exercitation deserunt sit cupidatat.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Dickson Herman'
                },
                {
                  'id': 1,
                  'name': 'Hester Serrano'
                },
                {
                  'id': 2,
                  'name': 'Tran Bishop'
                }
              ],
              'greeting': 'Hello, Bowman Acosta! You have 6 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b07f36215fffda83ca',
              'index': 2,
              'guid': 'b73a4045-c8a0-467f-b6df-115b0c603fe6',
              'isActive': true,
              'balance': '$2,363.24',
              'picture': 'http://placehold.it/32x32',
              'age': 25,
              'eyeColor': 'blue',
              'name': 'Gwen Miles',
              'gender': 'female',
              'company': 'DIGITALUS',
              'email': 'gwenmiles@digitalus.com',
              'phone': '+1 (874) 499-2813',
              'address': '550 Bedford Place, Boonville, Michigan, 5998',
              'about': 'Ad aute id ex irure veniam tempor aliquip aute occaecat non qui nisi aute aliqua. Deserunt deserunt minim et qui ut. Reprehenderit elit ullamco in incididunt. Consectetur aliqua velit nostrud eu reprehenderit occaecat minim sunt cillum nisi exercitation incididunt veniam consequat. Consequat eu non sint Lorem sit nulla mollit mollit pariatur nulla aute exercitation ut.\r\n',
              'registered': '2015-07-24T04:20:35 -10:00',
              'latitude': -46.681625,
              'longitude': 93.787359,
              'tags': [
                'qui',
                'non',
                'officia',
                'sunt',
                'nisi',
                'est',
                'ipsum'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Deserunt amet esse amet laboris adipisicing ea quis culpa labore. Nulla anim amet consequat elit dolore aute eiusmod ullamco et culpa aliqua voluptate. Pariatur cillum culpa veniam Lorem duis id aliquip tempor sint Lorem quis ullamco ut. Eiusmod magna in reprehenderit voluptate amet aliquip. Commodo tempor ullamco occaecat occaecat exercitation ad id nisi ex exercitation aute do dolore qui. Aliquip non laborum ipsum laboris voluptate irure amet non qui.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Carver Carpenter'
                },
                {
                  'id': 1,
                  'name': 'Collier Graham'
                },
                {
                  'id': 2,
                  'name': 'Franco Rivas'
                }
              ],
              'greeting': 'Hello, Gwen Miles! You have 1 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b08ce8d23a66d74c9b',
              'index': 3,
              'guid': '26e534bc-ee59-407d-b7e4-a1145b69a16f',
              'isActive': true,
              'balance': '$2,220.69',
              'picture': 'http://placehold.it/32x32',
              'age': 34,
              'eyeColor': 'brown',
              'name': 'Mcdaniel Frazier',
              'gender': 'male',
              'company': 'CRUSTATIA',
              'email': 'mcdanielfrazier@crustatia.com',
              'phone': '+1 (949) 507-3241',
              'address': '693 McClancy Place, Lindisfarne, Minnesota, 3771',
              'about': 'Dolor ex officia aute occaecat veniam irure laborum nulla tempor sint. Elit Lorem consectetur ex aliqua culpa reprehenderit ad quis exercitation aliqua consequat voluptate. Sunt commodo officia quis cillum aliquip aliqua aliquip ut. Ex sit consequat qui adipisicing ut laborum veniam irure elit esse. Do sint culpa ipsum mollit aute qui ex mollit duis duis. Incididunt sit eiusmod elit sit eiusmod. Elit ea reprehenderit exercitation et adipisicing reprehenderit ipsum cupidatat quis nulla.\r\n',
              'registered': '2014-11-12T10:21:10 -11:00',
              'latitude': -1.320696,
              'longitude': 72.068919,
              'tags': [
                'ipsum',
                'magna',
                'cupidatat',
                'voluptate',
                'proident',
                'reprehenderit',
                'velit'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Culpa nostrud et laborum qui nisi ad sint ea. Ut dolor amet aliqua eiusmod cillum aliquip nostrud tempor ad id cupidatat exercitation aliqua est. Ut ad amet qui eiusmod esse adipisicing fugiat fugiat ullamco ullamco deserunt. Magna eu labore cillum aute aliqua velit in consequat. Aliqua adipisicing aliqua exercitation eu. Esse ea culpa pariatur reprehenderit sit laborum minim commodo velit velit eiusmod sunt deserunt laboris.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Pittman Sparks'
                },
                {
                  'id': 1,
                  'name': 'Cooley Fitzpatrick'
                },
                {
                  'id': 2,
                  'name': 'Burgess Rivera'
                }
              ],
              'greeting': 'Hello, Mcdaniel Frazier! You have 7 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b086cbbe17295d9454',
              'index': 4,
              'guid': 'bac74a45-5d23-4e06-9160-51f44330c578',
              'isActive': true,
              'balance': '$3,507.23',
              'picture': 'http://placehold.it/32x32',
              'age': 33,
              'eyeColor': 'brown',
              'name': 'Schwartz Hensley',
              'gender': 'male',
              'company': 'ASSURITY',
              'email': 'schwartzhensley@assurity.com',
              'phone': '+1 (804) 452-2975',
              'address': '986 Gerald Court, Laurelton, Colorado, 1035',
              'about': 'Nulla non culpa qui nulla. Elit excepteur laborum anim reprehenderit qui dolor dolor. Minim do aliqua velit eiusmod adipisicing. Consequat cupidatat duis eiusmod pariatur nulla ipsum duis ipsum proident ad do. Ad tempor officia ex ea officia.\r\n',
              'registered': '2015-10-15T06:49:59 -11:00',
              'latitude': -82.640929,
              'longitude': 30.846681,
              'tags': [
                'fugiat',
                'incididunt',
                'magna',
                'et',
                'amet',
                'est',
                'nostrud'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Voluptate fugiat exercitation nulla duis culpa eiusmod voluptate reprehenderit sit non. Incididunt cupidatat eiusmod nulla nisi labore fugiat esse ea do elit excepteur non. Et do duis sunt aute est commodo non.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Baker Gilbert'
                },
                {
                  'id': 1,
                  'name': 'Holmes Farrell'
                },
                {
                  'id': 2,
                  'name': 'Eula Mccray'
                }
              ],
              'greeting': 'Hello, Schwartz Hensley! You have 10 unread messages.',
              'favoriteFruit': 'apple'
            },
            {
              '_id': '579a79b0e062b2108a9ca1cc',
              'index': 5,
              'guid': '0b3a55d1-7754-4469-a6da-1940701f89c5',
              'isActive': false,
              'balance': '$1,231.39',
              'picture': 'http://placehold.it/32x32',
              'age': 37,
              'eyeColor': 'blue',
              'name': 'Shauna Decker',
              'gender': 'female',
              'company': 'PARLEYNET',
              'email': 'shaunadecker@parleynet.com',
              'phone': '+1 (869) 474-3658',
              'address': '695 Blake Court, Trexlertown, Tennessee, 2128',
              'about': 'Do enim deserunt eiusmod enim cupidatat eu anim elit do velit. Voluptate id elit voluptate sunt. Nulla sint quis Lorem aliquip. Magna enim sit ut qui et sunt nisi reprehenderit Lorem. In dolore dolore non ex esse aliqua minim esse. Velit veniam id elit qui qui consectetur officia nulla non reprehenderit dolor commodo consectetur duis. Cupidatat pariatur eu velit amet exercitation nulla id in exercitation minim.\r\n',
              'registered': '2016-07-25T09:37:06 -10:00',
              'latitude': 10.081668,
              'longitude': -112.750664,
              'tags': [
                'sunt',
                'sunt',
                'ullamco',
                'irure',
                'anim',
                'ullamco',
                'enim'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Et eu nisi magna esse cillum tempor dolor voluptate. Laborum magna exercitation dolore mollit veniam eiusmod enim aliquip. Dolor anim et culpa consectetur sint do eiusmod cupidatat nostrud irure commodo.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Shelly Rios'
                },
                {
                  'id': 1,
                  'name': 'Melba Lambert'
                },
                {
                  'id': 2,
                  'name': 'Figueroa Mcdonald'
                }
              ],
              'greeting': 'Hello, Shauna Decker! You have 2 unread messages.',
              'favoriteFruit': 'banana'
            },
            {
              '_id': '579a79b06dbe6d4fe13192aa',
              'index': 6,
              'guid': '6ae011b9-b532-4ed1-913a-2724943ed251',
              'isActive': false,
              'balance': '$3,551.59',
              'picture': 'http://placehold.it/32x32',
              'age': 34,
              'eyeColor': 'blue',
              'name': 'Debora Slater',
              'gender': 'female',
              'company': 'EXOTERIC',
              'email': 'deboraslater@exoteric.com',
              'phone': '+1 (841) 583-3557',
              'address': '905 Wythe Place, Wyano, Washington, 5223',
              'about': 'Eu labore deserunt magna in. Veniam minim laborum ut fugiat sit laborum esse excepteur anim dolor fugiat cillum. Consectetur laboris nulla aliquip tempor consequat commodo proident sunt nostrud officia aliquip aliqua. Elit labore occaecat duis dolor voluptate dolore.\r\n',
              'registered': '2015-03-13T12:57:16 -11:00',
              'latitude': 19.909618,
              'longitude': -83.213278,
              'tags': [
                'non',
                'nostrud',
                'irure',
                'qui',
                'exercitation',
                'sint',
                'incididunt'
              ],
              'deep': {
                'another': {
                  'oneMore': {
                    'name': 'Cillum mollit aute laboris ullamco veniam consequat pariatur voluptate mollit. Eiusmod dolore id magna ullamco exercitation ex laborum ullamco incididunt minim id deserunt est. Quis ex pariatur occaecat incididunt sunt ad aute amet tempor cupidatat officia anim.\r\n'
                  }
                }
              },
              'friends': [
                {
                  'id': 0,
                  'name': 'Ellen Mckee'
                },
                {
                  'id': 1,
                  'name': 'Mack Shaffer'
                },
                {
                  'id': 2,
                  'name': 'Gena Carter'
                }
              ],
              'greeting': 'Hello, Debora Slater! You have 7 unread messages.',
              'favoriteFruit': 'apple'
            }
          ]
        }

        console.log(new Date())
        const result = component.shouldComponentUpdate(null, anotherDifferentState)
        console.log(new Date())
        expect(result)
          .to.be.false
      })
    })
  })
})
