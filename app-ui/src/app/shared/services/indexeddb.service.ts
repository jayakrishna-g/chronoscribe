import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  constructor() { }

  openDB(dbName: string, storeName: string) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = (event: any) => {
        reject(`Error opening database ${dbName}: ${event.target.error}`);
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  saveToIndexedDB(dbName: string, storeName: string, data: any) {
    return new Promise<number>((resolve, reject) => {
      this.openDB(dbName, storeName).then((db) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = (event: any) => reject(event.target.error);
      });
    });
  }

  getFromIndexedDB(dbName: string, storeName: string, id: number) {
    return new Promise<any>((resolve, reject) => {
      this.openDB(dbName, storeName).then((db) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event: any) => reject(event.target.error);
      });
    });
  }

  createDatabase() {
    const dbName = 'educast-ldb';
    const storeName = 'FileStore';

    this.openDB(dbName, storeName)
      .then(db => {
        console.log(`Database ${dbName} opened successfully!`);
      })
      .catch(error => {
        console.error(`Error opening database ${dbName}:`, error);
      });
      console.log("Initialized DB");
  }

  saveFile(file: any) {
    if (file) {
      this.saveToIndexedDB('educast-ldb', 'FileStore', file)
        .then(id => console.log('File saved with id:', id))
        .catch(error => console.error('Error saving file:', error));
    }
  }

  loadFile() {
    const fileId = 1; // Replace with the ID of the file you want to load
    let file: File;
    this.getFromIndexedDB('educast-ldb', 'FileStore', fileId)
      .then((fileData: any) => {
        file = new File([fileData.data], fileData.name, { type: fileData.type });
        return file;
      })
      .catch(error => console.error('Error loading file:', error));
  }
 
}
