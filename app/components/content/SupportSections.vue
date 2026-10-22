<template>
  <div>
    <slot />
    <div class="support-options">
      <section>
        <slot name="donateur" />
      </section>
      <section>
        <slot name="sponsorkliks" />
      </section>
      <section>
        <slot name="vriendenloterij" />
      </section>
    </div>
  </div>
</template>
