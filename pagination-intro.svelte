<script>
  import { db, auth } from "./firebase";

  let data = []; /* The actual array of data displayable to components */
  let pageSize = 2;
  let hasMore = true;
  let query = db.collection("cities").orderBy("number");
  let firstDoc;
  let lastDoc;

  $: console.log(data);

  const onFirstData = () => {
    query
      .limit(pageSize)
      .get()
      .then((snapshot) => {
        hasMore = true;
        firstDoc = snapshot.docs[0];
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        data = snapshot.docs.map((doc) =>
          doc.data()
        ); /* If you want you can append to it instead of overwriting, helpfull for infinite scroll */
      });
  };

  const onNextData = () => {
    if (!firstDoc || !lastDoc) {
      console.log("Can't navigate yet");
    } else
      query
        .limit(pageSize)
        .startAfter(lastDoc)
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length == 0) {
            hasMore = false;
            console.log("Nothing more to fetch (next)");
            return;
          } else {
            firstDoc = snapshot.docs[0];
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            data = snapshot.docs.map((doc) => doc.data());
          }
        });
  };

  const onPrevData = () => {
    if (!firstDoc || !lastDoc) {
      console.log("Can't navigate yet");
    } else
      query
        .limitToLast(pageSize)
        .endBefore(firstDoc)
        .get()
        .then((snapshot) => {
          if (snapshot.docs.length == 0) {
            hasMore = false;
            console.log("Nothing more to fetch (prev)");
            return;
          } else {
            firstDoc = snapshot.docs[0];
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            data = snapshot.docs.map((doc) => doc.data());
          }
        });
  };
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello World!</h1>
  Visit the
  <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
  to learn how to build Svelte apps.
  <div>
    <button on:click={onFirstData}>Load Data</button>
    <button on:click={onNextData}>Next Page</button>
    <button on:click={onPrevData}>Prev Page</button>
  </div>

  <br />
  <br />

  <div>
    {#each data as city, i (i)}
      <div>{city.number} 👉 {city.name}</div>
    {:else}Click load data to get started...{/each}
  </div>

</main>
