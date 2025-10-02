<template>
  <div class="icon-selector" :class="{ 'has-label': content?.showLabel, [`label-${labelPosition}`]: content?.showLabel }">
    <!-- Icon Modal - Compact style like macOS emoji picker -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="content?.searchPlaceholder || 'Search icons...'"
            class="search-input"
            :style="searchInputStyle"
            ref="searchInput"
          />
        </div>

        <div class="icons-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon.value"
            class="icon-item"
            :class="{ selected: content?.selectedIcon === icon.value }"
            @click="selectIcon(icon.value)"
            :title="icon.name"
          >
            <component :is="icon.component" :size="24" />
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Icon Display -->
    <div class="icon-display" @click.stop.prevent="openModal">
      <div class="icon-wrapper" :style="iconStyle">
        <component v-if="currentIcon" :is="currentIcon" />
        <span v-else class="no-icon">?</span>
      </div>
      <span v-if="content?.showLabel" class="icon-label" :style="labelStyle">
        {{ iconLabel }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import * as PhosphorIcons from '@phosphor-icons/vue';

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const searchQuery = ref('');

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */
    /* wwEditor:start */
    // In production, isEditing is always false
    /* wwEditor:end */

    // Only Phosphor Regular
    const selectedLibrary = ref('phosphor-regular');

    // Get all Phosphor Regular icons
    const getAllIcons = computed(() => {
      const icons = [];

      try {
        // Phosphor icons - only regular (not Fill)
        Object.keys(PhosphorIcons).forEach((key) => {
          if (key.startsWith('Ph') && !key.endsWith('Fill') && typeof PhosphorIcons[key] === 'object') {
            const baseName = key.substring(2);
            const name = baseName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);

            icons.push({
              value: `phosphor/${name}`,
              name: name,
              component: PhosphorIcons[key],
            });
          }
        });
      } catch (error) {
        console.error('Error loading icons:', error);
      }

      return icons;
    });

    // Filtered icons based on search
    const filteredIcons = computed(() => {
      if (!getAllIcons.value || !Array.isArray(getAllIcons.value)) {
        return [];
      }

      let icons = getAllIcons.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        icons = icons.filter((icon) => icon?.name?.includes(query));
      }

      return icons;
    });

    // Get current icon component
    const currentIcon = computed(() => {
      const iconValue = props.content?.selectedIcon;
      if (!iconValue || !getAllIcons.value) return null;

      const icon = getAllIcons.value.find((i) => i?.value === iconValue);
      return icon?.component || null;
    });

    // Icon label
    const iconLabel = computed(() => {
      return props.content?.selectedIcon || 'No icon selected';
    });

    // Icon style
    const iconStyle = computed(() => ({
      width: props.content?.iconSize || '24px',
      height: props.content?.iconSize || '24px',
      color: props.content?.iconColor || '#000000',
    }));

    // Label style
    const labelStyle = computed(() => ({
      color: props.content?.labelColor || '#666666',
      fontSize: props.content?.labelSize || '14px',
    }));

    // Search input style
    const searchInputStyle = computed(() => ({
      fontSize: props.content?.searchTextSize || '13px',
      color: props.content?.searchTextColor || '#000000',
    }));

    // Label position
    const labelPosition = computed(() => props.content?.labelPosition || 'bottom');

    // Modal controls
    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      searchQuery.value = '';
    };

    // Select icon
    const selectIcon = (iconValue) => {
      emit('update:content', {
        ...props.content,
        selectedIcon: iconValue,
      });

      emit('trigger-event', {
        name: 'icon-change',
        event: { iconValue },
      });

      closeModal();
    };

    // Focus search input when modal opens
    const searchInput = ref(null);
    watch(showModal, (isOpen) => {
      if (isOpen) {
        setTimeout(() => {
          searchInput.value?.focus();
        }, 100);
      }
    });

    return {
      showModal,
      searchQuery,
      searchInput,
      filteredIcons,
      currentIcon,
      iconLabel,
      iconStyle,
      labelStyle,
      searchInputStyle,
      labelPosition,
      openModal,
      closeModal,
      selectIcon,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style lang="scss" scoped>
.icon-selector {
  width: fit-content;
  height: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &.has-label.label-bottom {
    flex-direction: column;
    gap: 8px;
  }

  &.has-label.label-top {
    flex-direction: column-reverse;
    gap: 8px;
  }

  &.has-label.label-left {
    flex-direction: row-reverse;
    gap: 12px;
  }

  &.has-label.label-right {
    flex-direction: row;
    gap: 12px;
  }
}

.icon-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .has-label & {
    flex-direction: inherit;
    gap: inherit;
  }
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
    transform: scale(1.05);
  }

  svg {
    display: block;
  }
}

.no-icon {
  font-size: 18px;
  font-weight: bold;
  color: #ccc;
}

.icon-label {
  font-family: monospace;
  white-space: nowrap;
}

// Modal styles - macOS emoji picker inspired
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  padding-top: 60px;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(40px);
  border-radius: 16px;
  width: 380px;
  height: 420px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.modal-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-input {
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: rgba(0, 0, 0, 0.06);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
}

.icons-grid {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }
}

.icon-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.12s ease;
  background: transparent;
  position: relative;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    transform: scale(1.15);
  }

  &.selected {
    background: rgba(59, 130, 246, 0.15);

    &::after {
      content: '';
      position: absolute;
      inset: -1px;
      border: 2px solid #3b82f6;
      border-radius: 6px;
      pointer-events: none;
    }
  }

  svg {
    color: #1d1d1f;
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding-top: 20px;
  }

  .modal-content {
    width: calc(100% - 40px);
    max-width: 380px;
  }

  .icons-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
