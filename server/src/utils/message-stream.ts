import { Duplex } from 'stream';

function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * It's a duplex stream that can set content into it and output
 * like a readable stream.
 */
export class MessageStream extends Duplex {
  public index: number = 0;
  public length: number;
  public message: string = '';
  public cost: number = 1500;
  constructor(...rest) {
    super(...rest);
  }
  setCost(cost: number) {
    this.cost = cost;
  }
  async _read() {
    if (this.index === this.length) {
      this.push(null);
      return;
    }
    // To mock the duration of text generation
    await sleep(Math.round(this.cost / this.length));
    this.push(this.message[this.index]);
    this.index += 1;
  }

  _write(chunk: string) {

    this.message += chunk.toString();
    this.length = this.message.length;
  }
}
