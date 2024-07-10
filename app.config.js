module.exports = {
    project: {
      ios: {
        iosbundleIdentifier: "com.khaled_nadam.rate-it"
      },
      android: {},  
    },
    expo:{
      extra:{
        eas:{
          projectId: "c81ab4f1-a1f5-4384-b113-e65e47d06184"
        }
      },
      ios:{
        bundleIdentifier: "com.khalednadam.rateit"
      },
      android:{
        package: "com.khalednadam.rateit"
      }
    },
    assets: ['./src/assets/fonts'],
    logo: ['./assets/images/logo.png'],
    ios:{
      bundleIdentifier: "com.khaled_nadam.rate-it"
    }
  };