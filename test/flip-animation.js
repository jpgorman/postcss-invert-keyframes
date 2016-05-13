import chai from "chai"
import plugin from "../src/index"
import postcss from "postcss"
const expect = chai.expect

function process(css) {
  return postcss(plugin()).process(css)
}

function normalise(string) {
  return string.replace(/\r?\n|\r|\t|\s/g, "")
}

describe("invert-animation plugin", () => {
  describe("is a function", () => {
    it("should be a function", () => {
      expect(plugin).to.be.a.function
    })
  })

  describe("matching algorithm", () => {

    it("should invert keyframes using from/to format", () => {

      const fixtureA = `@keyframes-reversable test {
        from {
          left: 0;
        }
        to {
          left: 200px;
        }
      }`

      const expectedA = `
      /* Inverted keyframes */
      @keyframes test {
        from {
          left: 0;
        }
        to {
          left: 200px;
        }
      }

      @keyframes test-reversed {
        to {
          left: 0;
        }
        from {
          left: 200px;
        }
      }`

      const actual = process(fixtureA)
      expect(actual.warnings()).to.be.empty
      expect(normalise(actual.css)).to.equal(normalise(expectedA))
    })

    it("should invert keyframes using % format", () => {

      const fixtureA = `@keyframes-reversable test {
        0%, 10%, 90% {
          left: 0;
          top: 0;
        }
        50% {
          left: 20px;
          top: 0;
        }
        20%, 100% {
          left: 200px;
          top: 0;
        }
      }`

      const expectedA = `
      /* Inverted keyframes */
      @keyframes test {
        0%, 10%, 90% {
          left: 0;
          top: 0;
        }
        50% {
          left: 20px;
          top: 0;
        }
        20%, 100% {
          left: 200px;
          top: 0;
        }
      }

      @keyframes test-reversed {
        100%, 90%, 10% {
          left: 0;
          top: 0;
        }
        50% {
          left: 20px;
          top: 0;
        }
        80%, 0% {
          left: 200px;
          top: 0;
        }
      }`

      const actual = process(fixtureA)
      expect(actual.warnings()).to.be.empty
      expect(normalise(actual.css)).to.equal(normalise(expectedA))
    })

  })
})
