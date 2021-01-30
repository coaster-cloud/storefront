<template>
  <b-row>
    <template v-for="index in 16">
      <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
        <b-card class="card-list" no-body>
          <b-skeleton-img card-img="top" aspect="16:9" />

          <div class="card-body">
            <div class="item-title text-center text-truncate">
              <b-skeleton width="85%" />
            </div>

            <div class="pt-2 text-muted text-small text-center">
              <b-skeleton width="70%" />
            </div>
          </div>
        </b-card>
      </b-col>
    </template>
  </b-row>
</template>
