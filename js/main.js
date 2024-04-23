function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function userRegister(url, id) {
  axios
    .post(
      url,
      {
        user_id: id,
      },
      {
        headers: {
          // authorization: "duvga9-gizref-tidJudsnalugbnpw-489hypawe",
          authorization: "3f5a60c940b1413aa57b9072d91581c3",
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

function entryRegister(url, data) {
  // const loadingOverlay = document.querySelector(".loading");
  const buttonWrapper = document.getElementById("countdown");
  // loadingOverlay.classList.remove("hidden");
  buttonWrapper.classList.add("hidden");
  axios
    .post(url, data, {
      headers: {
        "content-type": "multipart/form-data",
        // authorization: "duvga9-gizref-tidJudsnalugbnpw-489hypawe",
        authorization: "3f5a60c940b1413aa57b9072d91581c3",
      },
    })
    .then((response) => {
      // scan_end
      // unique_id -> response.data.unique_id
      // loadingOverlay.classList.add("hidden");
      window.location = `result.html?request_id=${response.data.request_id}`;
    })
    .catch((error) => {
      console.log(error);
    });
}
