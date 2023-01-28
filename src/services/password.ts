import bcrypt from 'bcrypt';

export class Password {
  static toHash(password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  static compare(storedPassword: string, suppliedPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(suppliedPassword, storedPassword, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

// export new Password();
