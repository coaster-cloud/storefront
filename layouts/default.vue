<template>
  <div>
    <b-container>
      <div class="container-shadow">
        <Nuxt />

        <div class="app-footer">
          <div class="row">
            <div class="col-md-9">
              License Text
            </div>
          </div>
          <div class="footer-bottom border-top pt-3 d-flex flex-column flex-sm-row align-items-center">
            <div class="d-flex align-items-center">
              <img class="logo" src="@/assets/images/logo.png">
              <div>
                <div>
                  <p class="m-0">
                    &copy; {{ new Date().getFullYear() }} coaster.cloud | Version: 1.0.0
                  </p>
                  <p class="m-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<style lang="scss">
@import "@/assets/css/ci.scss";
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

body {
  background-color: #eee;
}

h1,
h2,
h3,
h4,
h5,
.modal-title {
  color: $primary;
}

.container-shadow {
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);
  background-color: #fff;
}

.app-footer {
  background: $gray-200;
  padding: 1.25rem;
  .footer-bottom {
    width: 100%;
    .logo {
      width: 3rem;
      height: auto;
      margin: 4px;
    }
  }
}
</style>
