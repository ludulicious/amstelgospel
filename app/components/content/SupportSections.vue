<template>
  <div>
    <slot />
    <div class="support-options">
      <section>
        <span class="support-number">01</span><slot name="donateur" />
      </section>
      <section>
        <span class="support-number">02</span><slot name="sponsorkliks" />
      </section>
      <section>
        <span class="support-number">03</span><slot name="vriendenloterij" />
      </section>
    </div>
  </div>
</template>
