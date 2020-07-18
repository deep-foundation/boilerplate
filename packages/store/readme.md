# deepcase store

## usage

```tsx
<QueryStoreProvider>
  <CookiesStoreProvider>
    <LocalStoreProvider>
      <CapacitorStoreProvider fetchInterval={5000}>
        <Content/>
      </CapacitorStoreProvider>
    </LocalStoreProvider>
  </CookiesStoreProvider>
</QueryStoreProvider>
```

```tsx
const [query, setQuery] = useQueryStore('demo', 5);
// ?demo=5
const [cookie, setCookie] = useCookiesStore('demo', 5);
// cookies demo=5
const [local, setLocal] = useLocalStore('demo', 5);
// localStorage.getItem('demo') // 5
const [capacitor, setCapacitor] = useCapacitorStore('demo', 5);
// await Storage.get('demo') // { value: 5 }
```

## compatibility

- [x] useStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useCookiesStore
  - [x] web
  - [x] android
  - [ ] ios
  - [ ] electron
- [x] useQueryStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useLocalStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron
- [x] useCapacitorStore
  - [x] web
  - [x] android
  - [x] ios
  - [x] electron