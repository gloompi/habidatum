const customFetch = <T>(url: string): Promise<T> => (
  new Promise((resolve, reject) => {
    fetch(new Request(url, {
      mode: "cors",
      method: "GET",
    }))
      .then(res => res.json())
      .then(body => resolve(body))
      .catch(err => reject(err));
  })
)

export default customFetch;
